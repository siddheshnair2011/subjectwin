import { router, protectedProcedure } from "./_core/trpc";
import Stripe from "stripe";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25.dahlia" as any,
});

/**
 * Billing and Invoice Management Router
 * Handles subscription billing history and invoice retrieval
 */
export const billingRouter = router({
  /**
   * Get billing history for the current user
   * Returns list of invoices from Stripe
   */
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.user.email) {
        return {
          invoices: [],
          error: "User email not found",
        };
      }

      // Retrieve invoices for the user's email
      const invoices = await stripe.invoices.list({
        limit: 50,
      } as any);

      return {
        invoices: invoices.data.map((invoice: any) => ({
          id: invoice.id,
          number: invoice.number,
          date: new Date(invoice.created * 1000),
          amount: invoice.total,
          currency: invoice.currency,
          status: invoice.status,
          pdfUrl: invoice.hosted_invoice_url,
          description: invoice.description,
          periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : null,
          periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
        })),
        error: null,
      };
    } catch (error: any) {
      console.error("[Billing] Failed to get invoice history:", error);
      return {
        invoices: [],
        error: error?.message || "Failed to retrieve billing history",
      };
    }
  }),

  /**
   * Get a specific invoice PDF URL
   */
  getInvoicePdf: protectedProcedure
    .input(z.object({ invoiceId: z.string() }))
    .query(async ({ input }: { input: any }) => {
      try {
        const invoice = await stripe.invoices.retrieve(input.invoiceId) as any;

        return {
          url: invoice.hosted_invoice_url || invoice.pdf,
          filename: `invoice-${invoice.number}.pdf`,
        };
      } catch (error: any) {
        console.error("[Billing] Failed to get invoice PDF:", error);
        throw new Error(error?.message || "Failed to retrieve invoice PDF");
      }
    }),

  /**
   * Get current subscription details
   */
  getSubscriptionDetails: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.user.email) {
        return {
          subscription: null,
          error: "User email not found",
        };
      }

      // Get customer from Stripe
      const customers = await stripe.customers.list({
        email: ctx.user.email,
        limit: 1,
      });

      if (customers.data.length === 0) {
        return {
          subscription: null,
          error: null,
        };
      }

      const customer = customers.data[0];

      // Get active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length === 0) {
        return {
          subscription: null,
          error: null,
        };
      }

      const subscription = subscriptions.data[0] as any;
      const currentPeriodStart = new Date(subscription.current_period_start * 1000);
      const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

      return {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          plan: subscription.items.data[0]?.price?.nickname || "Unknown",
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
          nextBillingDate: currentPeriodEnd,
        },
        error: null,
      };
    } catch (error: any) {
      console.error("[Billing] Failed to get subscription details:", error);
      return {
        subscription: null,
        error: error?.message || "Failed to retrieve subscription details",
      };
    }
  }),

  /**
   * Cancel subscription at end of current billing period
   */
  cancelAtPeriodEnd: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      if (!ctx.user.email) {
        throw new Error("User email not found");
      }

      // Get customer from Stripe
      const customers = await stripe.customers.list({
        email: ctx.user.email,
        limit: 1,
      });

      if (customers.data.length === 0) {
        throw new Error("Customer not found");
      }

      const customer = customers.data[0];

      // Get active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length === 0) {
        throw new Error("No active subscription found");
      }

      const subscription = subscriptions.data[0] as any;

      // Cancel at period end
      const updated = await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
      }) as any;

      return {
        success: true,
        canceledAt: new Date(updated.canceled_at! * 1000),
        endsAt: new Date(updated.current_period_end * 1000),
      };
    } catch (error: any) {
      console.error("[Billing] Failed to cancel subscription:", error);
      throw new Error(error?.message || "Failed to cancel subscription");
    }
  }),

  /**
   * Reactivate a subscription that was scheduled for cancellation
   */
  reactivateSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      if (!ctx.user.email) {
        throw new Error("User email not found");
      }

      // Get customer from Stripe
      const customers = await stripe.customers.list({
        email: ctx.user.email,
        limit: 1,
      });

      if (customers.data.length === 0) {
        throw new Error("Customer not found");
      }

      const customer = customers.data[0];

      // Get subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        limit: 1,
      });

      if (subscriptions.data.length === 0) {
        throw new Error("No subscription found");
      }

      const subscription = subscriptions.data[0];

      // Reactivate
      const updated = await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: false,
      });

      return {
        success: true,
        status: updated.status,
      };
    } catch (error: any) {
      console.error("[Billing] Failed to reactivate subscription:", error);
      throw new Error(error?.message || "Failed to reactivate subscription");
    }
  }),
});
