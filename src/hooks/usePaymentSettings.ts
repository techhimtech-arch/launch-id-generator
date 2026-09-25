import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UPI_CONFIG } from "@/lib/upi-config";

export type PaymentSettings = {
  id: boolean;
  upi_id: string;
  payee_name: string;
  amount: number;
  currency: string;
  payment_note: string;
  payments_enabled: boolean;
};

const fallback: PaymentSettings = {
  id: true,
  upi_id: UPI_CONFIG.upiId,
  payee_name: UPI_CONFIG.payeeName,
  amount: UPI_CONFIG.amount,
  currency: "INR",
  payment_note: UPI_CONFIG.note,
  payments_enabled: true,
};

export function usePaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings>(fallback);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("payment_settings").select("id,upi_id,payee_name,amount,currency,payment_note,payments_enabled").eq("id", true).maybeSingle();
    if (data) setSettings(data);
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { settings, loading, refresh };
}

export function buildPaymentUri(settings: PaymentSettings) {
  const params = new URLSearchParams({ pa: settings.upi_id, pn: settings.payee_name, am: String(settings.amount), cu: settings.currency, tn: settings.payment_note });
  return `upi://pay?${params.toString()}`;
}

export function buildPaymentQrUrl(settings: PaymentSettings, size = 240) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(buildPaymentUri(settings))}`;
}
