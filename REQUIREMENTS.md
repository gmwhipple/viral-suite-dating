# Viral Suite Dating — Product Requirements

**Project:** AI Dating Profile Makeover Service  
**Support Email:** contact@viral-suite.com  
**Location:** `/Users/G-Whiz/Documents/viral-suite-dating`  
**Hosting Target:** Replit (Autoscale deployment)  
**Last Updated:** June 29, 2026

---

## 1. Product Overview

A web service where users upload personal photos, pay via Stripe, and receive AI-generated dating profile pictures. The service trains a personalized character using **Higgsfield Character Soul 2.0**, generates photos styled after **100 curated reference templates**, supports **AI edits** via **FAL Nano Banana 2**, and delivers **watermark-free downloads**.

---

## 2. User Flows

### 2.1 Landing Page (A/B Testing Built-In)

| Requirement | Status | Notes |
|-------------|--------|-------|
| High-converting landing page | ✅ | Two variants (A: rose/light, B: dark/violet) |
| A/B test assignment (50/50) | ✅ | Cookie-based `vs_ab_variant`, session `vs_session` |
| Track views, CTA clicks, signups, purchases | ✅ | Firestore `ab_test_events` collection |
| Pricing section with $49 one-time offer | ✅ | Configurable in `src/lib/constants.ts` |
| FAQ, social proof stats, feature grid | ✅ | Variant A includes full sections |
| Support email visible | ✅ | contact@viral-suite.com |

### 2.2 Authentication

| Requirement | Status | Notes |
|-------------|--------|-------|
| Email/password signup & login | ✅ | Firebase Auth |
| User data in Firebase (not Replit DB) | ✅ | Firestore collections |
| Protected dashboard route | ✅ | Redirects to `/login` if unauthenticated |

### 2.3 Payment (Stripe)

| Requirement | Status | Notes |
|-------------|--------|-------|
| One-time payment checkout | ✅ | Stripe Checkout Session |
| Webhook for payment confirmation | ✅ | `checkout.session.completed` |
| Activate paid plan on success | ✅ | Sets `plan: paid`, 100 gen limit |
| Connected to user's Stripe account | ⚙️ | User provides `STRIPE_SECRET_KEY` + creates Product/Price |

### 2.4 Photo Upload Dashboard

| Requirement | Status | Notes |
|-------------|--------|-------|
| Upload up to 100 photos | ✅ | Enforced server-side |
| Example "good" photos shown above upload | ✅ | 4 examples with Unsplash images |
| Example "bad" photos shown above upload | ✅ | 4 anti-patterns with labels |
| Drag & drop + file picker | ✅ | JPG, PNG, WEBP, max 15MB |
| Photo grid preview | ✅ | Shows all uploaded photos |
| Store photos in Replit App Storage | ✅ | `@replit/object-storage` on Replit |
| Local dev fallback storage | ✅ | `.local-storage/` + `/api/storage/` |

### 2.5 Higgsfield Soul 2.0 Training

| Requirement | Status | Notes |
|-------------|--------|-------|
| Minimum 10 photos to start training | ✅ | `MIN_SOUL_TRAINING_PHOTOS = 10` |
| Pending/waiting state during training | ✅ | `pending_training` → `training` |
| Poll Higgsfield for completion | ✅ | `/api/soul/train` GET + dashboard auto-refresh |
| Webhook on generation complete | ✅ | `/api/webhooks/higgsfield` |
| Store soul reference ID on user | ✅ | `soulReferenceId` in Firestore |

### 2.6 Photo Generation

| Requirement | Status | Notes |
|-------------|--------|-------|
| 100 style reference templates | ✅ | `src/data/style-references.json` |
| User picks reference, generates photo | ✅ | Style picker with category filters |
| Max 100 generations per paid user | ✅ | Enforced via `generationsUsed` / `generationsLimit` |
| Job states: queued → processing → watermark_removal → completed | ✅ | Full pipeline |
| Pending state until Higgsfield returns | ✅ | Status badges in gallery |

### 2.7 AI Edits (FAL Nano Banana 2)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Text prompts ("change my shirt to...") | ✅ | Per-photo edit panel |
| Attachment image for outfit swaps | ✅ | Multipart upload support |
| "Remove XX from photo" prompts | ✅ | Natural language via Nano Banana |
| Uses FAL_KEY (primary) | ✅ | `fal-ai/nano-banana-2/edit` |
| OpenRouter fallback | ⚙️ | Env var reserved; FAL is primary (easier setup) |

### 2.8 Watermark Removal (Backend)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Remove watermarks before user download | ✅ | Runs on every generation + edit |
| Primary: FAL inpainting prompt | ✅ | "Remove all watermarks..." |
| Fallback: Sharp corner composite | ✅ | Blurs common watermark regions |

### 2.9 Activity Tracking (Debugging)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Log all user actions | ✅ | `activity_logs` Firestore collection |
| Collapsible debug panel in dashboard | ✅ | Shows action, timestamp, metadata |
| Server-side console.log for all events | ✅ | `[activity]` prefixed logs |

---

## 3. Technical Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Next.js   │────▶│   Firebase   │     │  Replit Storage │
│  (Replit)   │     │  Firestore   │     │  (user photos)  │
└──────┬──────┘     │  + Auth      │     └─────────────────┘
       │            └──────────────┘
       │
       ├────▶ Stripe (payments + webhooks)
       ├────▶ Higgsfield API (Soul 2.0 train + generate)
       ├────▶ FAL API (Nano Banana 2 edits + watermark removal)
       └────▶ Sharp (watermark fallback)
```

### Firestore Collections

| Collection | Purpose |
|------------|---------|
| `users` | Profile, plan, soul status, generation counts |
| `photos` | Uploaded photo metadata + storage keys |
| `generations` | AI generation jobs and results |
| `edits` | AI edit jobs and results |
| `activity_logs` | Debug/audit trail |
| `ab_test_events` | Landing page A/B analytics |

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/upload` | POST/GET | Upload & list user photos |
| `/api/soul/train` | POST/GET | Start training / poll status |
| `/api/soul/generate` | POST | Generate styled photo |
| `/api/webhooks/higgsfield` | POST | Higgsfield completion webhook |
| `/api/edit` | POST | AI photo edits |
| `/api/stripe/checkout` | POST | Create checkout session |
| `/api/stripe/webhook` | POST | Stripe payment webhook |
| `/api/dashboard` | GET | Full dashboard state |
| `/api/ab-test` | GET/POST | A/B test assignment & tracking |
| `/api/activity` | GET | Activity log retrieval |
| `/api/storage/[[...key]]` | GET | Serve stored images |

---

## 4. Environment Variables

Copy `.env.example` to `.env.local` (local) or Replit Secrets (production):

```bash
# Required
NEXT_PUBLIC_APP_URL=https://your-repl.replit.app
NEXT_PUBLIC_FIREBASE_*          # Firebase client config
FIREBASE_PROJECT_ID             # Firebase Admin
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_PRICE_ID
HIGGSFIELD_API_KEY
HIGGSFIELD_API_SECRET
HIGGSFIELD_WEBHOOK_SECRET
FAL_KEY
```

---

## 5. Replit Deployment Guide

### Step 1: Push to GitHub
```bash
cd ~/Documents/viral-suite-dating
git remote add origin https://github.com/YOUR_USER/viral-suite-dating.git
git push -u origin main
```

### Step 2: Import to Replit
1. Go to [replit.com](https://replit.com) → **Create Repl** → **Import from GitHub**
2. Select your repository
3. Replit auto-detects Next.js via `.replit` config

### Step 3: Enable App Storage
1. In Replit workspace → **Tools** → **App Storage**
2. Create a bucket (Agent can also scaffold this)
3. Photos stored at `private/{userId}/{uuid}.ext`

### Step 4: Set Secrets (Workspace + Deployment)
Add ALL env vars from `.env.example` in:
- **Tools → Secrets** (development)
- **Deployments → Secrets** (production — required separately!)

Set `NEXT_PUBLIC_APP_URL` to your deployed URL (e.g. `https://viral-suite-dating.YOUR_USERNAME.replit.app`)

### Step 5: Deploy
1. Click **Deploy** → choose **Autoscale**
2. Build command: `npm run build` (auto from `.replit`)
3. Run command: `npm run start`
4. First deploy takes 3-5 minutes

### Step 6: Configure Webhooks

**Stripe Webhook** (Dashboard → Developers → Webhooks):
- URL: `https://YOUR-REPL-URL.replit.app/api/stripe/webhook`
- Events: `checkout.session.completed`

**Higgsfield Webhook** (set in API dashboard or via client):
- URL: `https://YOUR-REPL-URL.replit.app/api/webhooks/higgsfield`
- Secret: match `HIGGSFIELD_WEBHOOK_SECRET`

### Step 7: Firebase Setup
1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password
3. Create **Firestore** database
4. Deploy rules from `firestore.rules`
5. Create composite indexes (Firestore will prompt via console links):
   - `generations`: `userId ASC, createdAt DESC`
   - `photos`: `userId ASC, uploadedAt DESC`
   - `edits`: `userId ASC, createdAt DESC`
   - `activity_logs`: `userId ASC, createdAt DESC`

### Step 8: Stripe Product Setup
1. Create Product: "Profile Makeover Pro" — $49 one-time
2. Copy Price ID → `STRIPE_PRICE_ID`
3. Copy Secret Key → `STRIPE_SECRET_KEY`
4. Copy Publishable Key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Step 9: Higgsfield Setup
1. Get API credentials from [higgsfield.ai](https://higgsfield.ai)
2. Set `HIGGSFIELD_API_KEY` and `HIGGSFIELD_API_SECRET`
3. Soul 2.0 uses endpoint `/v1/text2image/soul` with `text2image_soul_v2` job type

### Step 10: FAL Setup
1. Get API key from [fal.ai/dashboard](https://fal.ai/dashboard)
2. Set `FAL_KEY`

---

## 6. Local Development

```bash
cd ~/Documents/viral-suite-dating
cp .env.example .env.local
# Fill in credentials
npm run dev
```

Open http://localhost:3000

For Stripe webhooks locally, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 7. Support & Contact

- **Support Email:** contact@viral-suite.com
- **Activity Debugging:** Dashboard → "Activity log (debug)" panel
- **Server Logs:** Replit console or `npm run dev` terminal

---

## 8. Future Enhancements (Not in Scope)

- [ ] OpenRouter fallback for edits when FAL is unavailable
- [ ] Admin dashboard for all-user activity (`/api/activity?admin=true`)
- [ ] Email notifications when training/generation completes
- [ ] Custom domain via Replit Domains
- [ ] Refund handling via Stripe
