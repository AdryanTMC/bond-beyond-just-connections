import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type PlanTier = "free" | "plus" | "gold" | "infinity";

type Ctx = { premium: boolean; tier: PlanTier; loading: boolean; refresh: () => Promise<void> };
const PremiumContext = createContext<Ctx | null>(null);

const PAID_TIERS: PlanTier[] = ["plus", "gold", "infinity"];

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // Entitlement is read from the server (public.subscriptions) and cannot be
  // set from the client. Users can only read their own row via RLS, and no
  // INSERT/UPDATE policy exists — so premium status can never be self-granted.
  const [tier, setTier] = useState<PlanTier>("free");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setTier("free");
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("subscriptions")
      .select("tier,status")
      .eq("user_id", user.id)
      .maybeSingle();
    const active = data?.status === "active" || data?.status === "trialing";
    setTier(active ? ((data?.tier as PlanTier) ?? "free") : "free");
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const premium = PAID_TIERS.includes(tier);

  return (
    <PremiumContext.Provider value={{ premium, tier, loading, refresh: load }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) return { premium: false, tier: "free" as PlanTier, loading: false, refresh: async () => {} };
  return ctx;
}