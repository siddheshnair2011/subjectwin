import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  brandProfiles,
  campaignAnalyses,
  seedSubjects,
  variants,
  campaignOutcomes,
  subscriptions,
  usageTracking
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Brand Profile queries
export async function getBrandProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(brandProfiles)
    .where(eq(brandProfiles.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function upsertBrandProfile(userId: number, data: {
  audienceDescription?: string;
  industry?: string;
  tonePreferences?: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await getBrandProfile(userId);

  if (existing) {
    await db
      .update(brandProfiles)
      .set(data)
      .where(eq(brandProfiles.userId, userId));
    return { ...existing, ...data };
  } else {
    const result = await db
      .insert(brandProfiles)
      .values({
        userId,
        ...data,
      });
    return { id: result[0].insertId, userId, ...data };
  }
}

// Campaign Analysis queries
export async function createCampaignAnalysis(userId: number, data: {
  campaignType: string;
  campaignContext: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .insert(campaignAnalyses)
    .values({
      userId,
      ...data,
    });

  return { id: result[0].insertId, userId, ...data };
}

export async function getCampaignAnalysis(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(campaignAnalyses)
    .where(eq(campaignAnalyses.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserCampaignAnalyses(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(campaignAnalyses)
    .where(eq(campaignAnalyses.userId, userId))
    .orderBy(desc(campaignAnalyses.createdAt));
}

// Seed Subject queries
export async function createSeedSubject(analysisId: number, text: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .insert(seedSubjects)
    .values({ analysisId, text });

  return { id: result[0].insertId, analysisId, text };
}

export async function getSeedSubjects(analysisId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(seedSubjects)
    .where(eq(seedSubjects.analysisId, analysisId));
}

// Variant queries
export async function createVariant(data: {
  analysisId: number;
  text: string;
  predictedLift: number;
  tone: string;
  explanation: string;
  selected?: boolean;
}) {
  const db = await getDb();
  if (!db) return undefined;

  const insertData: any = {
    analysisId: data.analysisId,
    text: data.text,
    predictedLift: data.predictedLift.toString(),
    tone: data.tone,
    explanation: data.explanation,
    selected: data.selected || false,
  };

  const result = await db
    .insert(variants)
    .values(insertData);

  return { id: result[0].insertId, ...data };
}

export async function getVariants(analysisId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(variants)
    .where(eq(variants.analysisId, analysisId))
    .orderBy(desc(variants.predictedLift));
}

export async function updateVariantSelection(variantId: number, selected: boolean) {
  const db = await getDb();
  if (!db) return undefined;

  await db
    .update(variants)
    .set({ selected })
    .where(eq(variants.id, variantId));

  return { id: variantId, selected };
}

// Campaign Outcome queries
export async function createCampaignOutcome(data: {
  analysisId: number;
  actualOpenRate: number;
  provider: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  const insertData: any = {
    analysisId: data.analysisId,
    actualOpenRate: data.actualOpenRate.toString(),
    provider: data.provider,
  };

  const result = await db
    .insert(campaignOutcomes)
    .values(insertData);

  return { id: result[0].insertId, ...data };
}

export async function getCampaignOutcome(analysisId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(campaignOutcomes)
    .where(eq(campaignOutcomes.analysisId, analysisId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// Subscription queries
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createSubscription(userId: number, data: {
  plan?: 'free' | 'growth' | 'accelerator';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status?: 'active' | 'canceled' | 'past_due';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}) {
  const db = await getDb();
  if (!db) return undefined;

  const insertData: any = {
    userId,
    plan: data.plan || 'free',
    status: data.status || 'active',
  };
  if (data.stripeCustomerId) insertData.stripeCustomerId = data.stripeCustomerId;
  if (data.stripeSubscriptionId) insertData.stripeSubscriptionId = data.stripeSubscriptionId;
  if (data.currentPeriodStart) insertData.currentPeriodStart = data.currentPeriodStart;
  if (data.currentPeriodEnd) insertData.currentPeriodEnd = data.currentPeriodEnd;

  const result = await db
    .insert(subscriptions)
    .values(insertData);

  return { id: result[0].insertId, userId, ...insertData };
}

export async function updateSubscription(userId: number, data: {
  plan?: 'free' | 'growth' | 'accelerator';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status?: 'active' | 'canceled' | 'past_due';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}) {
  const db = await getDb();
  if (!db) return undefined;

  const updateData: Record<string, any> = {};
  if (data.plan !== undefined) updateData.plan = data.plan;
  if (data.stripeCustomerId !== undefined) updateData.stripeCustomerId = data.stripeCustomerId;
  if (data.stripeSubscriptionId !== undefined) updateData.stripeSubscriptionId = data.stripeSubscriptionId;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.currentPeriodStart !== undefined) updateData.currentPeriodStart = data.currentPeriodStart;
  if (data.currentPeriodEnd !== undefined) updateData.currentPeriodEnd = data.currentPeriodEnd;

  if (Object.keys(updateData).length > 0) {
    await db
      .update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.userId, userId));
  }

  return { userId, ...data };
}

// Usage Tracking queries
export async function getCurrentMonthUsage(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const result = await db
    .select()
    .from(usageTracking)
    .where(and(
      eq(usageTracking.userId, userId),
      eq(usageTracking.month, month)
    ))
    .limit(1);

  return result.length > 0 ? result[0].analysesCount : 0;
}

export async function incrementUsageCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const existing = await db
    .select()
    .from(usageTracking)
    .where(and(
      eq(usageTracking.userId, userId),
      eq(usageTracking.month, month)
    ))
    .limit(1);

  if (existing.length > 0) {
    const newCount = existing[0].analysesCount + 1;
    await db
      .update(usageTracking)
      .set({ analysesCount: newCount })
      .where(eq(usageTracking.id, existing[0].id));
    return newCount;
  } else {
    await db
      .insert(usageTracking)
      .values({
        userId,
        month,
        analysesCount: 1,
      });
    return 1;
  }
}
