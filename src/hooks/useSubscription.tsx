import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const LEASE_KEY = "idcard-studio:lease";
const CLOCK_KEY = "idcard-studio:last-time";

export function useSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [offlineLeaseValid, setOfflineLeaseValid] = useState(true);

  const checkClockTamper = useCallback(() => {
    const now = Date.now();
    const lastStr = localStorage.getItem(CLOCK_KEY);
    const last = lastStr ? parseInt(lastStr, 10) : 0;
    
    // If current time is earlier than last known time, clock was likely set back
    if (last > 0 && now < last - 60000) { // 1 min buffer
      return true;
    }
    localStorage.setItem(CLOCK_KEY, now.toString());
    return false;
  }, []);

  const refresh = useCallback(async () => {
    if (!user) {
      setActive(false);
      setExpiresAt(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data }, { data: adminRole }] = await Promise.all([
      supabase
      .from("subscriptions")
      .select("expires_at, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("expires_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle(),
    ]);

    if (adminRole?.role === "admin") {
      setActive(true);
      setExpiresAt(null);
    } else if (data && new Date(data.expires_at) > new Date()) {
      setActive(true);
      setExpiresAt(data.expires_at);
      // Store lease for offline verification
      localStorage.setItem(LEASE_KEY, JSON.stringify({
        uid: user.id,
        exp: data.expires_at,
        lastOnline: new Date().toISOString()
      }));
    } else {
      setActive(false);
      setExpiresAt(data?.expires_at ?? null);
    }

    // Anti-tamper check
    if (checkClockTamper()) {
      setOfflineLeaseValid(false);
    }

    setLoading(false);
  }, [user, checkClockTamper]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Offline fallback check
  useEffect(() => {
    if (!loading && !active && user) {
      const leaseStr = localStorage.getItem(LEASE_KEY);
      if (leaseStr) {
        try {
          const lease = JSON.parse(leaseStr);
          if (lease.uid === user.id && new Date(lease.exp) > new Date()) {
            // Check if they've been offline too long (e.g. 15 days)
            const daysSinceOnline = (Date.now() - new Date(lease.lastOnline).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceOnline < 100 && !checkClockTamper()) {
              setActive(true);
              setExpiresAt(lease.exp);
            } else if (daysSinceOnline >= 100) {
              setOfflineLeaseValid(false);
            }
          }
        } catch (e) {
          console.error("Lease error", e);
        }
      }
    }
  }, [loading, active, user, checkClockTamper]);

  return { 
    isSubscribed: active, 
    expiresAt, 
    loading, 
    refresh,
    isOfflineLeaseValid: offlineLeaseValid 
  };
}
