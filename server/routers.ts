import { COOKIE_NAME } from "@shared/const";
import Stripe from "stripe";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25" as any,
});
import {
  getBrandProfile,
  upsertBrandProfile,
  createCampaignAnalysis,
  getUserCampaignAnalyses,
  getCampaignAnalysis,
  createSeedSubject,
  createVariant,
  getVariants,
  updateVariantSelection,
  createCampaignOutcome,
  getCampaignOutcome,
  getUserSubscription,
  getCurrentMonthUsage,
  incrementUsageCount,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { connectRouter } from "./routers-connect";
import { billingRouter } from "./routers-billing";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  brand: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await getBrandProfile(ctx.user.id);
    }),
    upsert: protectedProcedure
      .input(z.object({
        audienceDescription: z.string().optional(),
        industry: z.string().optional(),
        tonePreferences: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await upsertBrandProfile(ctx.user.id, input);
      }),
  }),

  campaign: router({
    create: protectedProcedure
      .input(z.object({
        campaignType: z.string(),
        campaignContext: z.string(),
        seedSubjects: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const usage = await getCurrentMonthUsage(ctx.user.id);
        const sub = await getUserSubscription(ctx.user.id);
        const plan = sub?.plan || 'free';

        if (plan === 'free' && usage >= 2) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Free tier limit reached (2 analyses/month). Upgrade to continue.',
          });
        }

        await incrementUsageCount(ctx.user.id);
        return await createCampaignAnalysis(ctx.user.id, input);
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserCampaignAnalyses(ctx.user.id);
    }),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getCampaignAnalysis(input.id);
      }),
  }),

  variant: router({
    generate: protectedProcedure
      .input(z.object({
        analysisId: z.number(),
        seedSubjects: z.array(z.string()).min(1).max(3),
      }))
      .mutation(async ({ input }) => {
        const analysis = await getCampaignAnalysis(input.analysisId);
        if (!analysis) throw new TRPCError({ code: 'NOT_FOUND' });

        const brand = await getBrandProfile(analysis.userId);

        // Store seed subjects
        for (const seed of input.seedSubjects) {
          await createSeedSubject(input.analysisId, seed);
        }

        // Generate variants using LLM
        const prompt = `You are an expert email marketing specialist. Generate 10 subject line variants optimized for maximum open rates.

Campaign Type: ${analysis.campaignType}
Campaign Context: ${analysis.campaignContext}
Audience: ${brand?.audienceDescription || 'General audience'}
Industry: ${brand?.industry || 'General'}
Tone Preferences: ${brand?.tonePreferences || 'Professional'}
Seed Subject Lines: ${input.seedSubjects.join(', ')}

For each variant, provide:
1. Subject line text (40-60 characters optimal)
2. Predicted open rate lift (as percentage, e.g., 15.5)
3. Tone classification (e.g., urgency, curiosity, personalization, social_proof, exclusivity)
4. Brief explanation of why it should perform well

Format as JSON array with objects: { text, predictedLift, tone, explanation }`;

        const response = await invokeLLM({
          messages: [{ role: 'user', content: prompt }],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'subject_variants',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  variants: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        text: { type: 'string' },
                        predictedLift: { type: 'number' },
                        tone: { type: 'string' },
                        explanation: { type: 'string' },
                      },
                      required: ['text', 'predictedLift', 'tone', 'explanation'],
                      additionalProperties: false,
                    },
                  },
                },
                required: ['variants'],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message.content;
        const parsed = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));

        const variants = [];
        for (const v of parsed.variants.slice(0, 10)) {
          const variant = await createVariant({
            analysisId: input.analysisId,
            text: v.text,
            predictedLift: v.predictedLift,
            tone: v.tone,
            explanation: v.explanation,
          });
          variants.push(variant);
        }

        return variants;
      }),
    select: protectedProcedure
      .input(z.object({ variantId: z.number() }))
      .mutation(async ({ input }) => {
        return await updateVariantSelection(input.variantId, true);
      }),
    list: protectedProcedure
      .input(z.object({ analysisId: z.number() }))
      .query(async ({ input }) => {
        return await getVariants(input.analysisId);
      }),
  }),

  outcome: router({
    upload: protectedProcedure
      .input(z.object({
        analysisId: z.number(),
        actualOpenRate: z.number().min(0).max(100),
        provider: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await createCampaignOutcome(input);
      }),
    get: protectedProcedure
      .input(z.object({ analysisId: z.number() }))
      .query(async ({ input }) => {
        return await getCampaignOutcome(input.analysisId);
      }),
  }),

  subscription: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSubscription(ctx.user.id);
    }),
  }),

  // Stripe Connect integration for marketplace
  connect: connectRouter,

  // Billing and invoices
  billing: billingRouter,

  // Subscription checkout
  checkout: router({
    create: publicProcedure
      .input(z.object({
        priceId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const origin = ctx.req.headers.origin || "https://example.com";
          const session = await stripeClient.checkout.sessions.create({
            line_items: [
              {
                price: input.priceId,
                quantity: 1,
              },
            ],
            mode: "subscription",
            success_url: `${origin}/dashboard?upgrade=success`,
            cancel_url: `${origin}/dashboard/upgrade`,
            customer_email: ctx.user?.email || undefined,
          });

          return {
            url: session.url,
          };
        } catch (error: any) {
          console.error("[Checkout] Failed to create session:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error?.message || "Failed to create checkout session",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
