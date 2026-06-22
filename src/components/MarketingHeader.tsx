import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Crown, IdCard, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function MarketingHeader() {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const nav = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(Boolean(data)));
  }, [user]);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <IdCard className="h-5 w-5 text-primary" />
          ID Card Studio
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3 text-sm">
          <Link to="/templates" className="hidden sm:inline text-muted-foreground hover:text-foreground px-2">
            Templates
          </Link>
          <Link to="/pricing" className="text-muted-foreground hover:text-foreground px-2">
            Pricing
          </Link>
          <Link to="/contact" className="hidden sm:inline text-muted-foreground hover:text-foreground px-2">
            Contact
          </Link>
          {isAdmin && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => nav("/admin/payments")}>
              <Shield className="h-3.5 w-3.5" /> Admin
            </Button>
          )}
          {user ? (
            <>
              {isSubscribed && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  <Crown className="h-3 w-3" /> Pro
                </span>
              )}
              <Button size="sm" onClick={() => nav("/app")}>Open app</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav("/auth")}>Log in</Button>
              <Button size="sm" onClick={() => nav("/app")}>Try free</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
