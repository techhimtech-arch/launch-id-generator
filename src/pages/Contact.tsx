import { useState } from "react";
import MarketingHeader from "@/components/MarketingHeader";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MessageCircle, Clock } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || message.trim().length < 5) {
      toast({ title: "Please fill name, email and a short message.", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      message: message.trim(),
      user_id: user?.id ?? null,
    });
    setBusy(false);
    if (error) {
      toast({ title: "Could not send your message", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Message received", description: "Our team will get back to you within 1 business day." });
    setName(""); setEmail(""); setPhone(""); setMessage("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Contact Us — ID Card Studio Support"
        description="Get in touch with the ID Card Studio team. Phone, email and contact form for product, billing and partnership queries."
        path="/contact"
      />
      <MarketingHeader />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">We're here to help</h1>
          <p className="mt-4 text-muted-foreground">
            Questions about features, billing, or bulk orders? Reach out — we usually reply within a few hours on business days.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact details */}
          <aside className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Call our support team</div>
                  <a href="tel:+918618982400" className="text-lg font-semibold hover:text-primary">
                    +91 86189 82400
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">WhatsApp</div>
                  <a
                    href="https://wa.me/918618982400"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:text-primary"
                  >
                    Chat with us
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <a href="mailto:support@idcardstudio.app" className="text-lg font-semibold hover:text-primary">
                    support@idcardstudio.app
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/40 p-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Monday – Saturday · 10:00 AM – 7:00 PM IST</span>
              </div>
            </div>
          </aside>

          {/* Form */}
          <form onSubmit={submit} className="lg:col-span-3 rounded-xl border bg-card p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-xl font-semibold">Send us a message</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fill the form and we'll get back to you over email.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Your name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+91 ..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">How can we help? *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                maxLength={4000}
                placeholder="Tell us about your use case — number of cards, deadlines, anything specific."
              />
            </div>
            <Button type="submit" size="lg" disabled={busy} className="w-full sm:w-auto">
              {busy ? "Sending..." : "Send message"}
            </Button>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
