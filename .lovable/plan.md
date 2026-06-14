
# Phase 2 Plan — Paying Customers Jaldi Lana

Goal: Conversion badhao + naye users laao. Do parallel tracks: **(A) Revenue mechanics** jo existing visitors ko paying customer banayein, aur **(B) Marketing surface** jo naye visitors laaye.

---

## Track A — Revenue Mechanics

### 1. Free Trial with Watermark (hard lock hatao)
Abhi "Unlock to Download" hard wall hai → conversion kam hota hai. Instead:
- **Logged-out / non-subscriber**: PDF/PNG export allow, lekin har card ke neeche subtle **"Made with IDCard Studio — idcardstudio.app"** watermark.
- **First 3 exports/month free** (with watermark) → fir "Remove watermark, unlimited exports — ₹1499/year".
- Trial counter `subscriptions` table mein nahi, naya `export_usage` table mein (user_id, month, count).

### 2. School Plan (Enterprise tier)
Single user → multi-user, bigger ticket size.
- **Pro (Individual)** — ₹1499/year — 1 user, unlimited exports.
- **School Plan** — ₹4999/year — up to 5 teacher accounts, shared student database, priority support.
- `subscriptions.plan` already exists (`pro_yearly` / `school_yearly`), `seats` column add karenge + `school_id` linking.
- Pricing page pe 2 cards side-by-side, "Most popular" badge School pe.

### 3. Coupon Codes
Festive offers, school-bulk discounts, influencer codes.
- New table `coupons` (code, discount_pct ya flat_inr, max_uses, expires_at, applies_to_plan).
- Pricing page pe "Have a coupon?" input, edge function `validate-coupon` → discounted Razorpay order.
- Admin route `/admin/coupons` (sirf `admin` role) — create/list/disable.

### 4. Referral System
"Refer a school, get 3 months free both sides."
- `profiles.referral_code` (auto-generated on signup, 6-char).
- `referrals` table (referrer_id, referred_id, status, reward_granted_at).
- Signup page accepts `?ref=ABC123`; jab referred user paid karta hai → dono ki sub mein +90 days extend (edge function).
- Account page pe "Your referral link" + share buttons (WhatsApp/Email).

### 5. Expiry Reminders + Renewal
Churn rokne ke liye.
- Edge function `subscription-reminders` (cron via pg_cron) — 30/7/1 din pehle email bhejta hai.
- Account page pe expiry se 30 din pehle prominent "Renew now — 20% off" banner (with auto-coupon).
- Email via Resend (already integrate-able, naya secret `RESEND_API_KEY`).

---

## Track B — Marketing Surface

### 6. Proper Landing Page (`/`)
Abhi root pe seedha app khulta hai → SEO/marketing ke liye useless.
- Naya marketing landing at `/` with: hero (headline + demo screenshot/video), features grid (CSV upload, 5 templates, bulk PDF, custom design, QR codes), social proof placeholders (testimonials, school logos), pricing summary, FAQ, footer.
- App khud `/app` pe move ho jayega (existing flow waise hi).
- "Try free — no signup needed" CTA → `/app` direct, signup sirf export ke time.

### 7. Public Templates Showcase (`/templates`)
SEO honeypot — log search karte hain "school ID card template India".
- Static page with 10-15 template previews (vertical/horizontal/CBSE-style/preschool/college).
- Har template ka own URL (`/templates/cbse-vertical-blue`) for long-tail SEO.
- "Use this template" CTA → `/app` with that template pre-selected.

### 8. SEO Foundations
- Proper `<title>`, `<meta description>`, OG tags per route via `react-helmet-async`.
- `sitemap.xml` (auto-gen script) + `robots.txt`.
- JSON-LD: Organization on `/`, Product on `/pricing`, FAQPage on landing FAQ.
- Run SEO scan baad mein.

### 9. Demo Video / GIF
Landing page hero mein — 30-second screencast: CSV upload → mapping → preview → export. Placeholder rakhenge, user khud record karega ya hum loom embed ka spot reserve karenge.

### 10. Blog / Help Section (`/blog`)
Organic traffic ke liye. Initial 3 articles:
- "How to create school ID cards in bulk from Excel (2026 guide)"
- "Best ID card size and format for Indian schools"
- "Free vs paid ID card software: kya choose karein?"
Markdown-based, simple list + detail routes. Indexable.

---

## Rollout Order (priority)

**Sprint 1 — Revenue quick wins (max impact)**
1. Free trial with watermark + export counter
2. Coupon system + admin route
3. Renewal reminders email

**Sprint 2 — Marketing surface**
4. Landing page at `/`, app moves to `/app`
5. SEO meta tags + sitemap + robots
6. Templates showcase page

**Sprint 3 — Scale**
7. School Plan (multi-seat)
8. Referral system
9. Blog with 3 seed articles
10. SEO scan + iteration

---

## Technical Notes

- **Watermark**: Add as PDF text layer in `StepExport.tsx` `generatePdf()` when `!isSubscribed`. Toggle by sub status.
- **Export usage**: `public.export_usage(user_id, month_key, count)` — RLS user-own only. Increment in edge function on each export request (server-truth).
- **Coupons**: Razorpay order amount calculated server-side after coupon validation — never trust client.
- **Referral**: Reward applied via edge function on `payment.captured` webhook, idempotent.
- **Resend**: New secret `RESEND_API_KEY`, edge function uses `npm:resend`.
- **Landing route**: `/` becomes marketing, `/app` becomes the current Index.tsx. All existing local state/persistence unaffected.
- **Templates showcase**: Static data, no DB needed initially.

---

## Out of Scope (later phases)
- Student DB, QR attendance, WhatsApp send, AI bg remove, staff cards — these are **product depth** features, separate phase.
- Auto-recurring Razorpay subscriptions — manual yearly renewal kaafi hai abhi.

Approve karo to main Sprint 1 se start karunga.
