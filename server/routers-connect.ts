/**
 * Stripe Connect Router
 * Handles connected account creation, onboarding, product management, and orders
 */

import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import {
  createOrUpdateConnectAccount,
  getConnectAccountByUserId,
  getConnectAccountByStripeId,
  createProduct,
  getProductById,
  getProductsByConnectAccount,
  getAllProducts,
  createOrder,
  getOrderByCheckoutSessionId,
  updateOrderStatus,
  getOrdersByConnectAccount,
} from "./db-connect";

// Initialize Stripe client with API key
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25" as any,
});

export const connectRouter = router({
  /**
   * Create a Stripe Connect account for the current user
   * Uses V2 API with platform-managed fee collection
   */
  account: router({
    create: protectedProcedure
      .input(
        z.object({
          displayName: z.string().min(1),
          contactEmail: z.string().email(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          // Create connected account using V2 API
          // Platform is responsible for fees collection
          const account = await (stripeClient.v2 as any).core.accounts.create({
            display_name: input.displayName,
            contact_email: input.contactEmail,
            identity: {
              country: "us",
            },
            dashboard: "express",
            defaults: {
              responsibilities: {
                fees_collector: "application",
                losses_collector: "application",
              },
            },
            configuration: {
              recipient: {
                capabilities: {
                  stripe_balance: {
                    stripe_transfers: {
                      requested: true,
                    },
                  },
                },
              },
            },
          });

          if (!account?.id) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create Stripe Connect account",
            });
          }

          // Store the account mapping in database
          await createOrUpdateConnectAccount(ctx.user.id, {
            stripeAccountId: account.id,
            displayName: input.displayName,
            contactEmail: input.contactEmail,
            onboardingStatus: "pending",
          });

          return {
            stripeAccountId: account.id,
            displayName: input.displayName,
            contactEmail: input.contactEmail,
          };
        } catch (error: any) {
          console.error("[Connect] Failed to create account:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error?.message || "Failed to create Connect account",
          });
        }
      }),

    /**
     * Get the current user's Connect account
     */
    get: protectedProcedure.query(async ({ ctx }) => {
      try {
        const account = await getConnectAccountByUserId(ctx.user.id);
        if (!account) {
          return null;
        }

        // Fetch current status from Stripe API
        try {
          const stripeAccount = await (stripeClient.v2 as any).core.accounts.retrieve(
            account.stripeAccountId,
            {
              include: ["configuration.recipient", "requirements"],
            }
          );

          const readyToReceivePayments =
            stripeAccount?.configuration?.recipient?.capabilities?.stripe_balance
              ?.stripe_transfers?.status === "active";
          const requirementsStatus =
            stripeAccount.requirements?.summary?.minimum_deadline?.status;
          const onboardingComplete =
            requirementsStatus !== "currently_due" &&
            requirementsStatus !== "past_due";

          return {
            ...account,
            readyToReceivePayments,
            onboardingComplete,
            requirementsStatus,
          };
        } catch (error) {
          console.error("[Connect] Failed to fetch account status:", error);
          return account;
        }
      } catch (error: any) {
        console.error("[Connect] Failed to get account:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Connect account",
        });
      }
    }),

    /**
     * Create an account link for onboarding
     */
    createOnboardingLink: protectedProcedure.mutation(async ({ ctx }) => {
      try {
        const account = await getConnectAccountByUserId(ctx.user.id);
        if (!account) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No Connect account found. Create one first.",
          });
        }

        // Get the origin from the request for proper redirect
        const origin = ctx.req.headers.origin || "https://example.com";

        // Create account link using V2 API
        const accountLink = await (stripeClient.v2 as any).core.accountLinks.create({
          account: account.stripeAccountId,
          use_case: {
            type: "account_onboarding",
            account_onboarding: {
              configurations: ["recipient"],
              refresh_url: `${origin}/dashboard/connect`,
              return_url: `${origin}/dashboard/connect?accountId=${account.stripeAccountId}`,
            },
          },
        });

        if (!accountLink?.url) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create onboarding link",
          });
        }

        return {
          url: accountLink.url,
        };
      } catch (error: any) {
        console.error("[Connect] Failed to create onboarding link:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to create onboarding link",
        });
      }
    }),
  }),

  /**
   * Product management for the marketplace
   */
  product: router({
    /**
     * Create a product at the platform level
     * Linked to a specific connected account
     */
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          priceInCents: z.number().int().positive(),
          currency: z.string().default("usd"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const account = await getConnectAccountByUserId(ctx.user.id);
          if (!account) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "No Connect account found",
            });
          }

          // Create product at platform level
          const product = await stripeClient.products.create({
            name: input.name,
            description: input.description,
            default_price_data: {
              unit_amount: input.priceInCents,
              currency: input.currency,
            },
          });

          if (!product?.id) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create product",
            });
          }

          // Get the price ID from the product
          const prices = await stripeClient.prices.list({
            product: product.id,
            limit: 1,
          });

          const stripePriceId = prices.data[0]?.id;

          // Store product mapping in database
          const dbProduct = await createProduct({
            stripeProductId: product.id,
            stripeConnectAccountId: account.stripeAccountId,
            name: input.name,
            description: input.description,
            priceInCents: input.priceInCents,
            currency: input.currency,
            stripePriceId,
          });

          return dbProduct;
        } catch (error: any) {
          console.error("[Connect] Failed to create product:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error?.message || "Failed to create product",
          });
        }
      }),

    /**
     * Get all products for the seller's account
     */
    list: protectedProcedure.query(async ({ ctx }) => {
      try {
        const account = await getConnectAccountByUserId(ctx.user.id);
        if (!account) {
          return [];
        }

        return await getProductsByConnectAccount(account.stripeAccountId);
      } catch (error: any) {
        console.error("[Connect] Failed to list products:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch products",
        });
      }
    }),
  }),

  /**
   * Storefront - public access to all products
   */
  storefront: router({
    /**
     * Get all products from all sellers
     */
    products: publicProcedure.query(async () => {
      try {
        return await getAllProducts();
      } catch (error: any) {
        console.error("[Connect] Failed to fetch storefront products:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch products",
        });
      }
    }),

    /**
     * Create a checkout session for a product
     * Uses destination charges with application fees
     */
    createCheckout: publicProcedure
      .input(
        z.object({
          productId: z.number(),
          quantity: z.number().int().positive().default(1),
          customerEmail: z.string().email().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const product = await getProductById(input.productId);
          if (!product) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Product not found",
            });
          }

          // Calculate application fee (10% of total)
          const totalAmount = product.priceInCents * input.quantity;
          const applicationFeeAmount = Math.round(totalAmount * 0.1);

          // Get the origin for redirect URLs
          const origin = ctx.req.headers.origin || "https://example.com";

          // Create checkout session with destination charge
          const session = await stripeClient.checkout.sessions.create({
            line_items: [
              {
                price: product.stripePriceId || undefined,
                price_data: product.stripePriceId
                  ? undefined
                  : {
                      unit_amount: product.priceInCents,
                      currency: product.currency,
                      product_data: {
                        name: product.name,
                        description: product.description || undefined,
                      },
                    },
                quantity: input.quantity,
              },
            ],
            payment_intent_data: {
              application_fee_amount: applicationFeeAmount,
              transfer_data: {
                destination: product.stripeConnectAccountId,
              },
            },
            mode: "payment",
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout/cancel`,
            customer_email: input.customerEmail,
          });

          if (!session?.id) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create checkout session",
            });
          }

          // Store order in database
          await createOrder({
            stripeCheckoutSessionId: session.id,
            productId: input.productId,
            stripeConnectAccountId: product.stripeConnectAccountId,
            quantity: input.quantity,
            amountInCents: totalAmount,
            applicationFeeInCents: applicationFeeAmount,
            customerEmail: input.customerEmail,
          });

          return {
            sessionId: session.id,
            url: session.url,
          };
        } catch (error: any) {
          console.error("[Connect] Failed to create checkout:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error?.message || "Failed to create checkout session",
          });
        }
      }),
  }),

  /**
   * Order management
   */
  order: router({
    /**
     * Get order details by checkout session ID
     */
    getBySession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        try {
          const order = await getOrderByCheckoutSessionId(input.sessionId);
          if (!order) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Order not found",
            });
          }

          return order;
        } catch (error: any) {
          console.error("[Connect] Failed to get order:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch order",
          });
        }
      }),

    /**
     * Get all orders for the current seller
     */
    listForSeller: protectedProcedure.query(async ({ ctx }) => {
      try {
        const account = await getConnectAccountByUserId(ctx.user.id);
        if (!account) {
          return [];
        }

        return await getOrdersByConnectAccount(account.stripeAccountId);
      } catch (error: any) {
        console.error("[Connect] Failed to list orders:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch orders",
        });
      }
    }),
  }),
});
