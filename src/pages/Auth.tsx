import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Seo from "@/components/Seo";

export default function Auth() {
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) nav("/app", { replace: true });
  }, [user, nav]);

  const signInWithGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/app`,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      nav("/app", { replace: true });
    } catch (err: any) {
      toast({ title: "Google sign-in failed", description: err.message ?? String(err), variant: "destructive" });
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Seo
        title="Sign in — ID Card Studio"
        description="Access your ID Card Studio account to manage subscriptions and download cards."
        path="/auth"
        noindex
      />
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm text-center">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground absolute top-4 left-4">← Back</Link>
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to start creating ID cards.
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full mt-6"
          onClick={signInWithGoogle}
          disabled={busy}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 7.1 29.3 5 24 5 16.3 5 9.7 9.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35.2 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.2 5.2C41.5 35.9 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z"/>
          </svg>
          Continue with Google
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          By signing in, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
