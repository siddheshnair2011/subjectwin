# SubjectWin Development TODO

## Phase 1: Database Schema & Infrastructure
- [x] Extend drizzle schema with brandProfiles, campaignAnalyses, variants, outcomes, subscriptions tables
- [x] Generate and apply database migrations
- [x] Set up Stripe integration with API key secrets
- [ ] Configure owner notification system

## Phase 2: Public Landing Page
- [x] Design and build hero section with compelling headline and CTA
- [x] Build feature highlights section
- [x] Build pricing tiers section (Free, Growth, Accelerator)
- [x] Build sign-up call-to-action and navigation
- [x] Ensure responsive design and elegant styling

## Phase 3: Authentication & Dashboard
- [x] Implement Manus OAuth login flow (via template)
- [x] Build dashboard layout with stats and analysis list
- [x] Create brand profile setup page
- [x] Add user settings and profile management
- [x] Implement logout functionality

## Phase 4: Campaign Analysis Workflow
- [x] Build campaign context input form (campaign type, offer, context)
- [x] Build seed subject line input interface
- [x] Implement AI-powered subject line generation using built-in LLM
- [x] Display ranked variants with predicted lift, tone, and explanation
- [ ] Build variant regeneration feature

## Phase 5: Variant Selection & Export
- [x] Implement one-click copy functionality for subject lines
- [x] Build CSV export feature for analysis results
- [x] Create post-send outcome tracking form
- [x] Implement manual open-rate upload interface
- [x] Store selected variants and campaign linkage

## Phase 6: Analysis History & Dashboard
- [x] Build analysis history table/list view (in Dashboard)
- [ ] Implement prediction accuracy comparison (predicted vs actual)
- [ ] Create trend reporting by campaign type and tone
- [ ] Build confidence indicators based on accumulated data
- [ ] Add filtering and sorting capabilities

## Phase 7: Subscription & Billing
- [x] Implement free tier enforcement (2 analyses/month limit)
- [x] Integrate Stripe for subscription management
- [x] Build subscription plan selection and checkout flow
- [x] Implement plan upgrade/downgrade functionality
- [x] Add billing history and invoice management
- [x] Trigger owner notifications on sign-up and paid conversion

## Phase 8: Polish & Testing
- [x] Conduct vitest unit tests for core features
- [x] Verify elegant design and polish across all pages
- [x] Test subscription enforcement and limits
- [x] Validate AI output quality and consistency
- [ ] Performance optimization and accessibility review
- [x] Create final checkpoint and deploy

## Completed Features
- [x] Database schema with 8 tables (brandProfiles, campaignAnalyses, variants, outcomes, subscriptions, usageTracking, seedSubjects, users)
- [x] Stripe webhook endpoint with signature verification
- [x] Elegant landing page with pricing tiers
- [x] Dashboard with analysis list and user stats
- [x] Campaign analysis workflow with AI generation
- [x] Variant selection and CSV export
- [x] Outcome tracking with open rate upload
- [x] Brand profile setup page
- [x] Free tier enforcement (2 analyses/month)
- [x] 27 passing unit and integration tests
- [x] End-to-end analysis generation workflow


## Critical Fixes Required

### Stripe Webhook
- [x] Fix webhook endpoint to return valid JSON with "verified": true
- [x] Register route with express.raw() BEFORE express.json()
- [x] Implement proper signature verification
- [x] Handle test events (evt_test_*) correctly
- [x] Return HTTP 200 with valid JSON for all responses

### Analysis Generation Workflow
- [x] Complete end-to-end flow: NewAnalysis → create campaign → generate variants → AnalysisDetail
- [x] Pass seed subjects to variant.generate procedure
- [ ] Add loading/error states during generation
- [ ] Handle generation failures gracefully

### Protected Routes
- [ ] Add proper auth loading state to Dashboard
- [ ] Ensure queries don't fire before auth resolves
- [ ] Add error boundaries for failed queries

### Missing Pages
- [x] Build brand profile setup page (/dashboard/brand-profile)
- [x] Build settings page (/dashboard/settings)
- [x] Build upgrade/subscription page (/dashboard/upgrade)
- [x] Build billing history page (/dashboard/billing)
- [x] Build order confirmation page (/order-confirmation)
- [x] Remove placeholder links or implement corresponding pages

### Quality Improvements
- [x] Improve error handling and user feedback
- [ ] Add loading skeletons for better UX
- [x] Validate AI generation output
- [x] Test subscription enforcement end-to-end (27 tests passing)


## Phase 5: Stripe Connect Integration (NEW)

### Connected Account Management
- [x] Extend database schema to store Stripe Connect account IDs per user
- [x] Create API endpoint to create connected accounts using Stripe V2 API
- [x] Implement account creation with proper display_name, contact_email, and capabilities
- [x] Store mapping from user to connected account ID in database

### Account Onboarding
- [x] Create UI for "Onboard to collect payments" button
- [x] Implement account status display showing onboarding progress
- [x] Create account link generation endpoint using V2 API
- [x] Handle account link redirect and status updates
- [x] Display requirements status and completion status

### Webhook Handling for Connect
- [x] Create webhook handler for v2.account[requirements].updated events
- [x] Create webhook handler for v2.account[configuration.recipient].capability_status_updated events
- [x] Parse thin events and update account status
- [x] Log requirement changes for debugging

### Product Management
- [x] Create endpoint to create products at platform level
- [x] Store product-to-connected-account mapping
- [x] Build UI for product creation form
- [x] Display list of created products

### Storefront
- [x] Create storefront page displaying all products
- [x] Show products grouped by connected account/seller
- [x] Implement product filtering and search
- [x] Add product detail view

### Checkout & Payments
- [x] Create checkout session with destination charges
- [x] Implement application fee calculation
- [x] Set up transfer_data to route funds to connected account
- [x] Handle checkout success and failure redirects
- [x] Display order confirmation page

### Connect Dashboard
- [x] Create seller dashboard showing account status
- [x] Display onboarding requirements and deadlines
- [ ] Show earnings/transaction history
- [ ] Link to Stripe Express dashboard for sellers

### Billing Management
- [x] Create billing history page with invoice list
- [x] Implement invoice retrieval from Stripe
- [x] Add subscription details display
- [x] Implement cancel subscription at period end
- [x] Implement reactivate subscription
- [ ] Add payment method management
- [ ] Implement plan downgrade flow
