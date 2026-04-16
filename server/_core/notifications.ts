/**
 * Owner Notifications
 * Sends notifications to the site owner for important events
 */

import { notifyOwner } from "./notification";

/**
 * Notify owner of a new user sign-up
 */
export async function notifyNewSignup(user: {
  id: number;
  name?: string | null;
  email?: string | null;
  createdAt: Date;
}): Promise<boolean> {
  try {
    const result = await notifyOwner({
      title: "New User Sign-up",
      content: `A new user has signed up for SubjectWin!\n\nName: ${user.name || "N/A"}\nEmail: ${user.email || "N/A"}\nJoined: ${user.createdAt.toLocaleString()}`,
    });

    console.log("[Notifications] New signup notification sent:", result);
    return result;
  } catch (error) {
    console.error("[Notifications] Failed to send new signup notification:", error);
    return false;
  }
}

/**
 * Notify owner of a paid plan conversion
 */
export async function notifyPaidConversion(user: {
  id: number;
  name?: string | null;
  email?: string | null;
}, plan: "growth" | "accelerator"): Promise<boolean> {
  try {
    const planName = plan === "growth" ? "Growth ($99/month)" : "Accelerator ($299/month)";

    const result = await notifyOwner({
      title: "Paid Plan Conversion",
      content: `A user has upgraded to a paid plan!\n\nName: ${user.name || "N/A"}\nEmail: ${user.email || "N/A"}\nPlan: ${planName}\nTime: ${new Date().toLocaleString()}`,
    });

    console.log("[Notifications] Paid conversion notification sent:", result);
    return result;
  } catch (error) {
    console.error("[Notifications] Failed to send paid conversion notification:", error);
    return false;
  }
}

/**
 * Notify owner of a new marketplace product
 */
export async function notifyNewProduct(seller: {
  displayName?: string | null;
  contactEmail?: string | null;
}, product: {
  name: string;
  priceInCents: number;
}): Promise<boolean> {
  try {
    const result = await notifyOwner({
      title: "New Marketplace Product",
      content: `A seller has created a new product!\n\nSeller: ${seller.displayName || "N/A"}\nEmail: ${seller.contactEmail || "N/A"}\nProduct: ${product.name}\nPrice: $${(product.priceInCents / 100).toFixed(2)}\nTime: ${new Date().toLocaleString()}`,
    });

    console.log("[Notifications] New product notification sent:", result);
    return result;
  } catch (error) {
    console.error("[Notifications] Failed to send new product notification:", error);
    return false;
  }
}

/**
 * Notify owner of a marketplace order
 */
export async function notifyNewOrder(order: {
  amountInCents: number;
  customerEmail?: string | null;
  productName?: string;
}): Promise<boolean> {
  try {
    const result = await notifyOwner({
      title: "New Marketplace Order",
      content: `A new order has been placed on the marketplace!\n\nCustomer: ${order.customerEmail || "N/A"}\nProduct: ${order.productName || "N/A"}\nAmount: $${(order.amountInCents / 100).toFixed(2)}\nTime: ${new Date().toLocaleString()}`,
    });

    console.log("[Notifications] New order notification sent:", result);
    return result;
  } catch (error) {
    console.error("[Notifications] Failed to send new order notification:", error);
    return false;
  }
}
