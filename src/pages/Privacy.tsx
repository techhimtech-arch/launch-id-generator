import MarketingHeader from "@/components/MarketingHeader";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Privacy Policy — ID Card Studio"
        description="How ID Card Studio collects, uses, and protects your data. Browser-first processing, no photo uploads to our servers."
        path="/privacy"
      />
      <MarketingHeader />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 16 June 2026</p>

        <div className="prose prose-sm sm:prose-base mt-8 max-w-none text-foreground space-y-6">
          <p>
            ID Card Studio ("we", "us", "our") respects your privacy. This policy explains what information we
            collect, why we collect it, and how we handle it when you use our website and app.
          </p>

          <section>
            <h2 className="text-xl font-semibold">1. Information we collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account data:</strong> Name and email address when you sign in with Google.</li>
              <li><strong>Payment data:</strong> Subscription status and Razorpay payment IDs. Card details are handled by Razorpay; we never see or store them.</li>
              <li><strong>Support data:</strong> Anything you send via the Contact form (name, email, phone, message).</li>
              <li><strong>Usage data:</strong> Anonymous analytics like page views and feature usage to improve the product.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Your ID card data stays in your browser</h2>
            <p>
              Excel sheets, photos, and the cards you generate are processed locally in your browser.
              We do not upload them to our servers. Once you close the tab, that data is cleared (unless
              you have explicitly enabled local save).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. How we use your data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and operate the service.</li>
              <li>To process payments and manage subscriptions.</li>
              <li>To respond to support requests.</li>
              <li>To send transactional emails (receipts, account notices).</li>
              <li>To prevent fraud and abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Third-party services we use</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Supabase</strong> — authentication and database hosting.</li>
              <li><strong>Razorpay</strong> — payment processing.</li>
              <li><strong>Google</strong> — sign-in.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Cookies</h2>
            <p>
              We use essential cookies for authentication and to remember preferences. We do not use
              advertising or cross-site tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Data retention</h2>
            <p>
              Account and subscription data is retained as long as your account is active. Contact form
              submissions are kept for up to 24 months. You can request deletion at any time by emailing us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Your rights</h2>
            <p>
              You can access, correct, or delete your data by contacting us. We respond to all such requests
              within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Contact</h2>
            <p>
              For privacy questions, email <a className="text-primary underline" href="mailto:support@idcardstudio.app">support@idcardstudio.app</a> or
              call <a className="text-primary underline" href="tel:+918618982400">+91 86189 82400</a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
