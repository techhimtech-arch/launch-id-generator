import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Crown } from "lucide-react";
import { useEffect } from "react";

export default function Account() {
  const { user, signOut, loading } = useAuth();
  const { isSubscribed, expiresAt } = useSubscription();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav("/auth", { replace: true });
  }, [user, loading, nav]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Your Account — ID Card Studio" description="Manage your subscription and account details." path="/account" noindex />
      <AppHeader />
      <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Account</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Plan</div>
              <div className="text-lg font-semibold flex items-center gap-2">
                {isSubscribed ? (<><Crown className="h-4 w-4 text-primary" /> Pro</>) : "Free"}
              </div>
              {isSubscribed && expiresAt && (
                <div className="text-xs text-muted-foreground mt-1">
                  Expires on {new Date(expiresAt).toLocaleDateString()}
                </div>
              )}
            </div>
            <Button onClick={() => nav("/pricing")} variant={isSubscribed ? "outline" : "default"}>
              {isSubscribed ? "Renew" : "Upgrade"}
            </Button>
          </div>
        </div>

        <Button variant="outline" onClick={async () => { await signOut(); nav("/"); }}>
          Sign out
        </Button>
      </main>
    </div>
  );
}
