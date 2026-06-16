import MarketingHeader from "@/components/MarketingHeader";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";

export default function Refund() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Refund & Cancellation Policy — ID Card Studio"
        description="Our 7-day refund and cancellation policy for ID Card Studio Pro subscriptions."
        path="/refund"
      />
      <MarketingHeader />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-4xl font-bold tracking-tight">Refund &amp; Cancellation Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 16 June 2026</p>

        <div className="prose prose-sm sm:prose-base mt-8 max-w-none text-foreground space-y-6">
          <section>
            <h2 className="text-xl font-semibold">1. 7-day refund window</h2>
            <p>
              If you are not satisfied with your Pro subscription, you can request a full refund within
              <strong> 7 days</strong> of purchase — no questions asked. Email us and we will process the
              refund to your original payment method within 5–7 business days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. After 7 days</h2>
            <p>
              Refunds are not available after the 7-day window. Your subscription will remain active for the
              full year you paid for.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Cancellation</h2>
            <p>
              You can cancel your subscription anytime from your Account page or by contacting us. Cancellation
              stops future renewals; the Pro features remain active until the end of your paid period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. How to request a refund</h2>
            <p>Send an email to <a className="text-primary underline" href="mailto:support@idcardstudio.app">support@idcardstudio.app</a> with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The email address on your account</li>
              <li>The Razorpay payment ID (from your receipt)</li>
              <li>A brief reason (optional but helps us improve)</li>
            </ul>
            <p>You can also call us on <a className="text-primary underline" href="tel:+918618982400">+91 86189 82400</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Exceptions</h2>
            <p>
              We reserve the right to deny refund requests that show signs of abuse — for example, downloading
              hundreds of cards and then requesting a refund.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
