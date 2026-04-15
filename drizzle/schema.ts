import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  text, 
  timestamp, 
  varchar,
  decimal,
  boolean,
  json
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Brand profiles store audience and tone preferences for each user.
 * Users can have one active brand profile per account.
 */
export const brandProfiles = mysqlTable("brandProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  audienceDescription: text("audienceDescription"),
  industry: varchar("industry", { length: 255 }),
  tonePreferences: text("tonePreferences"), // JSON string of tone preferences
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BrandProfile = typeof brandProfiles.$inferSelect;
export type InsertBrandProfile = typeof brandProfiles.$inferInsert;

/**
 * Campaign analyses represent each subject line optimization session.
 * Each analysis has multiple variants and optionally a post-send outcome.
 */
export const campaignAnalyses = mysqlTable("campaignAnalyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  campaignType: varchar("campaignType", { length: 100 }), // e.g., "promotional", "educational", "re-engagement"
  campaignContext: text("campaignContext"), // Free-text description of the campaign
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CampaignAnalysis = typeof campaignAnalyses.$inferSelect;
export type InsertCampaignAnalysis = typeof campaignAnalyses.$inferInsert;

/**
 * Seed subject lines are the user-provided starting points for optimization.
 */
export const seedSubjects = mysqlTable("seedSubjects", {
  id: int("id").autoincrement().primaryKey(),
  analysisId: int("analysisId").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SeedSubject = typeof seedSubjects.$inferSelect;
export type InsertSeedSubject = typeof seedSubjects.$inferInsert;

/**
 * Variants are AI-generated subject line recommendations.
 * Each variant includes predicted lift, tone classification, and explanation.
 */
export const variants = mysqlTable("variants", {
  id: int("id").autoincrement().primaryKey(),
  analysisId: int("analysisId").notNull(),
  text: text("text").notNull(),
  predictedLift: decimal("predictedLift", { precision: 5, scale: 2 }), // e.g., 15.50 for 15.5%
  tone: varchar("tone", { length: 100 }), // e.g., "urgency", "curiosity", "personalization"
  explanation: text("explanation"), // Why this variant might perform well
  selected: boolean("selected").default(false), // Whether the user selected this variant
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Variant = typeof variants.$inferSelect;
export type InsertVariant = typeof variants.$inferInsert;

/**
 * Campaign outcomes store actual performance data after a campaign is sent.
 * Users can manually upload open rates to compare against predictions.
 */
export const campaignOutcomes = mysqlTable("campaignOutcomes", {
  id: int("id").autoincrement().primaryKey(),
  analysisId: int("analysisId").notNull(),
  actualOpenRate: decimal("actualOpenRate", { precision: 5, scale: 2 }), // e.g., 28.50 for 28.5%
  provider: varchar("provider", { length: 100 }), // e.g., "klaviyo", "mailchimp", "manual"
  syncedAt: timestamp("syncedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CampaignOutcome = typeof campaignOutcomes.$inferSelect;
export type InsertCampaignOutcome = typeof campaignOutcomes.$inferInsert;

/**
 * Subscriptions track user plan status and billing information.
 * Each user has one active subscription.
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plan: mysqlEnum("plan", ["free", "growth", "accelerator"]).default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  status: mysqlEnum("status", ["active", "canceled", "past_due"]).default("active").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Usage tracking for free tier enforcement.
 * Tracks the number of analyses performed in the current month.
 */
export const usageTracking = mysqlTable("usageTracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  month: varchar("month", { length: 7 }), // e.g., "2026-04" for April 2026
  analysesCount: int("analysesCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertUsageTracking = typeof usageTracking.$inferInsert;
