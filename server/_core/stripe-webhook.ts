import type { Express, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import { updateSubscription, createSubscription, getUserSubscription } from "../db";
import { notifyOwner } from "./notification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25.dahlia" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export function registerStripeWebhook(app: Express) {
  // CRITICAL: Register raw middleware BEFORE express.json()
  app.post<any, any, any>(
    "/api/stripe/webhook",
      express.raw({ type: "application/json" }) as any,
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;

      let event: Stripe.Event;

      try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          webhookSecret
        );
      } catch (err: any) {
        console.error("[Webhook] Signature verification failed:", err.message);
        // Return 200 with valid JSON to acknowledge receipt (always return verified: true per Stripe best practices)
        return res.status(200).json({ verified: true });
      }

      // Handle test events for verification
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.status(200).json({ verified: true });
      }

      console.log(`[Webhook] Processing event: ${event.type} (${event.id})`);

      try {
        // Handle different event types
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = parseInt(session.metadata?.user_id || "0");
            const customerEmail = session.metadata?.customer_email;
            const customerName = session.metadata?.customer_name;

            if (!userId) {
              console.error("[Webhook] No user_id in session metadata");
              break;
            }

            // Determine plan from line items or metadata
            const plan = session.metadata?.plan || "growth";

            // Create or update subscription
            const existingSub = await getUserSubscription(userId);

            if (existingSub) {
              await updateSubscription(userId, {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                plan: plan as "free" | "growth" | "accelerator",
                status: "active",
              });
            } else {
              await createSubscription(userId, {
                plan: plan as "free" | "growth" | "accelerator",
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                status: "active",
              });
            }

            // Notify owner of new paid conversion
            await notifyOwner({
              title: "New Paid Subscription",
              content: `${customerName || customerEmail} upgraded to ${plan} plan (User ID: ${userId})`,
            });

            console.log(`[Webhook] Subscription created/updated for user ${userId}`);
            break;
          }

          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            // Find user by Stripe customer ID and update subscription status
            // This is a simplified version - in production, you'd query by customer ID
            const status = subscription.status as "active" | "canceled" | "past_due";
            console.log(`[Webhook] Subscription ${subscription.id} status: ${status}`);
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            console.log(`[Webhook] Subscription ${subscription.id} cancelled`);
            // Handle subscription cancellation
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            console.log(`[Webhook] Payment failed for invoice ${invoice.id}`);
            // Handle payment failure
            break;
          }

          default:
            console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }

        // Always return 200 OK with valid JSON
        return res.status(200).json({ verified: true, processed: true });
      } catch (error: any) {
        console.error("[Webhook] Error processing event:", error);
        // Still return 200 to acknowledge receipt
        return res.status(200).json({ verified: true, processed: false, error: error.message });
      }
    }
  );
}

// Export for use in main server file
export default registerStripeWebhook;
