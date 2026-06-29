import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function useAdminGuard() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { nav("/auth"); return; }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data, error }) => setIsAdmin(!error && data?.role === "admin"));
  }, [user, authLoading, nav]);

  return { isAdmin, authLoading, user };
}
