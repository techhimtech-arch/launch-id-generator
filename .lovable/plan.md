# ID Card Studio — Subscription Plan (₹1499/year)

App ko ek SaaS bana denge. User free mein sab try kar sakta hai (CSV upload, mapping, preview), but **PDF/PNG export** pe paywall lagega. Ek hi plan: **₹1499/year**.

## 1. Backend setup (Lovable Cloud)
- Lovable Cloud enable karenge (Postgres + Auth + Edge Functions).
- Tables:
  - `profiles` — auth.users se linked (name, email, created_at).
  - `subscriptions` — user_id, status (`active`/`expired`/`cancelled`), started_at, expires_at, razorpay_payment_id, razorpay_order_id, amount.
  - `user_roles` + `app_role` enum (`admin`, `user`) — manual admin overrides ke liye.
- RLS: har user sirf apna data dekhe. `has_role()` security-definer function admin checks ke liye.
- Helper SQL function `public.is_subscribed(uid uuid)` → boolean, checks active sub with `expires_at > now()`.

## 2. Authentication
- Email + password signup/login (Lovable Cloud Auth).
- Optional Google login baad mein add kar sakte hain.
- Pages: `/login`, `/signup`, `/account` (sub status + logout).
- `onAuthStateChange` listener `App.tsx` mein, protected route wrapper.

## 3. Paywall logic
- Free (logged out ya non-subscriber):
  - CSV upload, column mapping, photo upload, **live preview** — sab allowed.
  - **Export buttons** (PDF, PNG, bulk download, print) — disabled, click pe "Upgrade to Pro" modal.
- Subscriber:
  - Sab unlocked, unlimited exports.
- `useSubscription()` hook — current user ka status fetch karega, components consume karenge.
- Export functions ke andar bhi server-side guard (edge function) — frontend bypass na ho.

## 4. Payments — Razorpay
- Razorpay account user khud banayega; hum 2 secrets store karenge: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.
- Edge Functions:
  - `create-razorpay-order` — auth required, ₹1499 ka order banata hai, returns order_id.
  - `verify-razorpay-payment` — signature verify karta hai, `subscriptions` row insert/update karta hai `expires_at = now() + 1 year`.
  - `razorpay-webhook` — `payment.captured` / `subscription.charged` events handle karega (backup verification + future auto-renewal).
- Frontend: Razorpay Checkout script load, order_id pass, success pe verify endpoint call.

## 5. UI changes
- **Pricing page** (`/pricing`) — ek card: "Pro — ₹1499/year", features list, "Subscribe" CTA.
- **Upgrade modal** — export click pe trigger, pricing summary + "Subscribe Now" button.
- **Account page** — current plan, expiry date, "Renew" button (30 din pehle se dikhana).
- **Header** — login/signup buttons ya user avatar dropdown.
- **Badge** preview pe ek subtle "Pro" lock icon export buttons pe.

## 6. Edge cases
- Expired sub: read-only access bana rahe, export lock ho jaye, banner "Subscription expired — renew karein".
- Refund/manual grant: admin user `user_roles` mein `admin` set karke kisi ko bhi sub extend kar sake (simple admin page).
- Payment fail: clear error toast, retry option.

## 7. Rollout order
1. Cloud enable + auth tables + RLS.
2. Login/signup UI + protected routes.
3. `subscriptions` table + `useSubscription` hook + paywall locks (test mode: hardcoded subscriber).
4. Razorpay secrets + edge functions + checkout integration.
5. Pricing page + upgrade modal + account page.
6. Webhook + admin overrides.
7. Test full flow (signup → try export → paywall → pay → export works).

## Technical notes
- Razorpay one-time order har year manual renewal hoga (simpler). Auto-recurring chahiye to Razorpay Subscriptions API use karenge — extra setup, baad mein add kar sakte hain.
- Pricing: ₹1499/year competitive hai schools ke liye, but agar bulk (1000+ cards/month) wale enterprise customers aate hain to ek "School plan" baad mein add karenge.
- Sab existing local features (CSV, mapping, preview, edit modal) waise hi rahenge — sirf export pe gate.
