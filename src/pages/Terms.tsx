import MarketingHeader from "@/components/MarketingHeader";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Terms of Service — ID Card Studio"
        description="Terms and conditions for using ID Card Studio's bulk ID card maker."
        path="/terms"
      />
      <MarketingHeader />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 16 June 2026</p>

        <div className="prose prose-sm sm:prose-base mt-8 max-w-none text-foreground space-y-6">
          <p>
            By accessing or using ID Card Studio ("the Service"), you agree to be bound by these Terms. If you
            do not agree, please do not use the Service.
          </p>

          <section>
            <h2 className="text-xl font-semibold">1. The Service</h2>
            <p>
              ID Card Studio is a web application that helps you generate ID cards in bulk from a spreadsheet.
              We offer a free tier with limited downloads and a paid Pro subscription.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Account</h2>
            <p>
              You are responsible for keeping your account secure. You must provide accurate information and
              promptly notify us of any unauthorised use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Subscription &amp; billing</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Pro plan: ₹899 per year, billed in advance.</li>
              <li>Payments are processed by Razorpay.</li>
              <li>Subscriptions do not auto-renew unless explicitly stated at checkout.</li>
              <li>Prices may change with at least 30 days' notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create fake, fraudulent, or misleading identity documents.</li>
              <li>Impersonate any organisation or individual.</li>
              <li>Reverse-engineer or attempt to disrupt the Service.</li>
              <li>Use the Service in violation of any law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Your content</h2>
            <p>
              You own all data you upload (lists, photos, designs). You grant us a limited licence to process
              it solely for the purpose of providing the Service to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Disclaimer</h2>
            <p>
              The Service is provided "as is" without warranties of any kind. We are not liable for any
              indirect or consequential damages arising from your use of the Service. Our total liability is
              limited to the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Termination</h2>
            <p>
              We may suspend or terminate accounts that violate these Terms. You may stop using the Service at
              any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Governing law</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes will be resolved in the courts of
              competent jurisdiction in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Contact</h2>
            <p>
              Questions about these Terms? Email <a className="text-primary underline" href="mailto:support@idcardstudio.app">support@idcardstudio.app</a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
