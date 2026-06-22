import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { MapPin, Lock, Loader2, Crown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/i18n";
import { usePremium } from "@/hooks/use-premium";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/map")({
  component: NearbyMap,
  head: () => ({ meta: [{ title: "Bond — Nearby" }] }),
});

type NearbyPerson = {
  id: string;
  name: string;
  photo: string | null;
  km: number;
  angle: number;
};

function NearbyMap() {
  const { t } = useLang();
  const { premium, loading: premiumLoading } = usePremium();
  const { user } = useAuth();
  const [people, setPeople] = useState<NearbyPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = user?.id;

  useEffect(() => {
    if (!userId || !premium) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("id,display_name,photos")
        .eq("is_active", true)
        .eq("onboarding_completed", true)
        .neq("id", userId)
        .limit(24);
      const built: NearbyPerson[] = (data ?? []).map((p, i) => ({
        id: p.id,
        name: p.display_name ?? "—",
        photo: p.photos?.[0] ?? null,
        km: 1 + ((i * 7) % 48),
        angle: (i * 137.5) % 360,
      })).sort((a, b) => a.km - b.km);
      setPeople(built);
      setLoading(false);
    })();
  }, [userId, premium]);

  const rings = useMemo(() => [0.35, 0.6, 0.85], []);

  return (
    <div>
      <div className="mb-6">
        <div className="text-sm text-muted-foreground">{t("map.subtitle")}</div>
        <h1 className="font-display text-3xl sm:text-4xl font-medium mt-1">
          <span className="text-gradient-coral">{t("map.title")}</span>
        </h1>
      </div>

      {premiumLoading || loading ? (
        <div className="h-[480px] rounded-3xl border border-border/70 bg-card flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !premium ? (
        <div className="relative h-[480px] rounded-3xl border border-border/70 bg-card overflow-hidden flex flex-col items-center justify-center text-center px-6">
          <RadarBackground rings={rings} blurred />
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-gradient-coral flex items-center justify-center shadow-glow mb-5">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">{t("map.locked")}</p>
            <Link
              to="/app/premium"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90"
            >
              <Crown className="h-4 w-4" /> {t("map.unlock")}
            </Link>
          </div>
        </div>
      ) : people.length === 0 ? (
        <div className="h-[480px] rounded-3xl border border-dashed border-border/70 bg-card/50 flex flex-col items-center justify-center text-center px-6">
          <MapPin className="h-8 w-8 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground max-w-xs">{t("map.empty")}</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative aspect-square max-h-[520px] mx-auto w-full rounded-3xl border border-border/70 bg-card overflow-hidden">
              <RadarBackground rings={rings} />
              {/* center = you */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gradient-coral ring-4 ring-background flex items-center justify-center text-white shadow-glow">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="mt-1.5 text-[11px] font-medium text-foreground">{t("map.you")}</span>
              </div>
              {people.map((p, i) => {
                const radius = Math.min(p.km / 50, 1) * 44; // % of half-width
                const rad = (p.angle * Math.PI) / 180;
                const left = 50 + Math.cos(rad) * radius;
                const top = 50 + Math.sin(rad) * radius;
                return (
                  <Link
                    key={p.id}
                    to="/app/discover"
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="h-9 w-9 rounded-full ring-2 ring-background bg-muted overflow-hidden flex items-center justify-center text-[11px] font-medium shadow-soft group-hover:ring-coral"
                    >
                      {p.photo ? (
                        <img src={p.photo} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        (p.name ?? "?").charAt(0)
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {people.length} {t("map.count")}
            </div>
            <ul className="space-y-2">
              {people.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/app/discover"
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 hover:border-foreground/30 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex items-center justify-center text-sm font-medium shrink-0">
                      {p.photo ? (
                        <img src={p.photo} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        (p.name ?? "?").charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {p.km} km {t("map.away")}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}

function RadarBackground({ rings, blurred }: { rings: number[]; blurred?: boolean }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${blurred ? "blur-md opacity-60" : ""}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-coral/5 to-transparent" />
      {rings.map((r, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/60"
          style={{ width: `${r * 100}%`, height: `${r * 100}%` }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-coral/30"
        style={{ width: "85%", height: "85%" }}
        animate={{ scale: [0.2, 1], opacity: [0.6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      />
    </div>
  );
}