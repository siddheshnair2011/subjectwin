/**
 * Stripe Connect Database Helpers
 * Functions for managing connected accounts, products, and orders
 */

import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import {
  stripeConnectAccounts,
  products,
  orders,
  InsertStripeConnectAccount,
  InsertProduct,
  InsertOrder,
} from "../drizzle/schema";

/**
 * Create or update a Stripe Connect account for a user
 */
export async function createOrUpdateConnectAccount(
  userId: number,
  data: {
    stripeAccountId: string;
    displayName?: string;
    contactEmail?: string;
    onboardingStatus?: "pending" | "in_progress" | "completed" | "failed";
    requirementsDue?: any;
  }
): Promise<typeof stripeConnectAccounts.$inferSelect | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const existing = await db
      .select()
      .from(stripeConnectAccounts)
      .where(eq(stripeConnectAccounts.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing account
      await db
        .update(stripeConnectAccounts)
        .set({
          stripeAccountId: data.stripeAccountId,
          displayName: data.displayName,
          contactEmail: data.contactEmail,
          onboardingStatus: data.onboardingStatus,
          requirementsDue: data.requirementsDue,
        })
        .where(eq(stripeConnectAccounts.userId, userId));

      return existing[0];
    } else {
      // Create new account
      const result = await db.insert(stripeConnectAccounts).values({
        userId,
        stripeAccountId: data.stripeAccountId,
        displayName: data.displayName,
        contactEmail: data.contactEmail,
        onboardingStatus: data.onboardingStatus || "pending",
        requirementsDue: data.requirementsDue,
      });

      return await getConnectAccountByUserId(userId);
    }
  } catch (error) {
    console.error("[Database] Failed to create/update connect account:", error);
    throw error;
  }
}

/**
 * Get a user's Stripe Connect account
 */
export async function getConnectAccountByUserId(
  userId: number
): Promise<typeof stripeConnectAccounts.$inferSelect | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(stripeConnectAccounts)
      .where(eq(stripeConnectAccounts.userId, userId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get connect account:", error);
    throw error;
  }
}

/**
 * Get a Stripe Connect account by Stripe account ID
 */
export async function getConnectAccountByStripeId(
  stripeAccountId: string
): Promise<typeof stripeConnectAccounts.$inferSelect | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(stripeConnectAccounts)
      .where(eq(stripeConnectAccounts.stripeAccountId, stripeAccountId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get connect account by Stripe ID:", error);
    throw error;
  }
}

/**
 * Create a product in the marketplace
 */
export async function createProduct(data: {
  stripeProductId: string;
  stripeConnectAccountId: string;
  name: string;
  description?: string;
  priceInCents: number;
  currency?: string;
  stripePriceId?: string;
}): Promise<typeof products.$inferSelect | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(products).values({
      stripeProductId: data.stripeProductId,
      stripeConnectAccountId: data.stripeConnectAccountId,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      currency: data.currency || "usd",
      stripePriceId: data.stripePriceId,
    });

    const productId = result[0]?.insertId || 0;
    return await getProductById(productId);
  } catch (error) {
    console.error("[Database] Failed to create product:", error);
    throw error;
  }
}

/**
 * Get a product by ID
 */
export async function getProductById(
  productId: number
): Promise<typeof products.$inferSelect | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get product:", error);
    throw error;
  }
}

/**
 * Get all products for a connected account
 */
export async function getProductsByConnectAccount(
  stripeConnectAccountId: string
): Promise<typeof products.$inferSelect[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(products)
      .where(eq(products.stripeConnectAccountId, stripeConnectAccountId));
  } catch (error) {
    console.error("[Database] Failed to get products:", error);
    throw error;
  }
}

/**
 * Get all products (for storefront)
 */
export async function getAllProducts(): Promise<typeof products.$inferSelect[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(products);
  } catch (error) {
    console.error("[Database] Failed to get all products:", error);
    throw error;
  }
}

/**
 * Create an order
 */
export async function createOrder(data: {
  stripeCheckoutSessionId: string;
  productId: number;
  stripeConnectAccountId: string;
  quantity: number;
  amountInCents: number;
  applicationFeeInCents: number;
  customerEmail?: string;
}): Promise<typeof orders.$inferSelect | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(orders).values({
      stripeCheckoutSessionId: data.stripeCheckoutSessionId,
      productId: data.productId,
      stripeConnectAccountId: data.stripeConnectAccountId,
      quantity: data.quantity,
      amountInCents: data.amountInCents,
      applicationFeeInCents: data.applicationFeeInCents,
      customerEmail: data.customerEmail,
      status: "pending",
    });

    const orderId = result[0]?.insertId || 0;
    return await getOrderById(orderId);
  } catch (error) {
    console.error("[Database] Failed to create order:", error);
    throw error;
  }
}

/**
 * Get an order by ID
 */
export async function getOrderById(
  orderId: number
): Promise<typeof orders.$inferSelect | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get order:", error);
    throw error;
  }
}

/**
 * Get an order by Stripe checkout session ID
 */
export async function getOrderByCheckoutSessionId(
  sessionId: string
): Promise<typeof orders.$inferSelect | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.stripeCheckoutSessionId, sessionId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get order by session ID:", error);
    throw error;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "completed" | "failed" | "canceled"
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId));
  } catch (error) {
    console.error("[Database] Failed to update order status:", error);
    throw error;
  }
}

/**
 * Get all orders for a connected account
 */
export async function getOrdersByConnectAccount(
  stripeConnectAccountId: string
): Promise<typeof orders.$inferSelect[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.stripeConnectAccountId, stripeConnectAccountId));
  } catch (error) {
    console.error("[Database] Failed to get orders:", error);
    throw error;
  }
}
