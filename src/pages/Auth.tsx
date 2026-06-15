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
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) nav("/app", { replace: true });
  }, [user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast({ title: "Account created", description: "You're signed in." });
        nav("/", { replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav("/", { replace: true });
      }
    } catch (err: any) {
      toast({ title: "Auth error", description: err.message ?? String(err), variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Seo
        title={mode === "signup" ? "Sign up — ID Card Studio" : "Log in — ID Card Studio"}
        description="Access your ID Card Studio account to manage subscriptions and download cards."
        path="/auth"
        noindex
      />
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
        <h1 className="mt-3 text-2xl font-semibold">{mode === "signup" ? "Create account" : "Welcome back"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "signup" ? "Sign up to access ID Card Studio." : "Log in to your account."}
        </p>
        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={async () => {
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
            }}
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
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>or</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4 mt-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground mt-4">
          {mode === "signup" ? (
            <>Already have an account? <button className="text-primary hover:underline" onClick={() => setMode("login")}>Log in</button></>
          ) : (
            <>No account? <button className="text-primary hover:underline" onClick={() => setMode("signup")}>Sign up</button></>
          )}
        </div>
      </div>
    </div>
  );
}
