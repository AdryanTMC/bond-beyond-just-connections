import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sparkles, Clock, Heart, X, Star, Flame } from "lucide-react";
import { useLang } from "@/i18n";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/")({
  component: AppHome,
});

type Person = { id: string; name: string; note: string; color: string; strength: number; photo: string | null };

function AppHome() {
  const { t } = useLang();
  const { user } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [stats, setStats] = useState({ matches: 0, messages: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: matches } = await supabase
        .from("matches")
        .select("id, user_a, user_b, created_at")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(12);
      const otherIds = (matches ?? []).map((m) => (m.user_a === user.id ? m.user_b : m.user_a));
      let profilesMap = new Map<string, { display_name: string | null; photos: string[] | null }>();
      if (otherIds.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, display_name, photos")
          .in("id", otherIds);
        profilesMap = new Map((profs ?? []).map((p) => [p.id, p]));
      }
      const tones = ["var(--color-romantic)", "var(--color-inner)", "var(--color-friends)", "var(--color-memory)", "var(--color-pro)"];
      setPeople(
        (matches ?? []).map((m, i) => {
          const otherId = m.user_a === user.id ? m.user_b : m.user_a;
          const p = profilesMap.get(otherId);
          return {
            id: otherId,
            name: p?.display_name ?? "—",
            note: new Date(m.created_at).toLocaleDateString(),
            color: tones[i % tones.length],
            strength: 70 + ((i * 7) % 30),
            photo: p?.photos?.[0] ?? null,
          };
        })
      );
      const { count: msgCount } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("sender_id", user.id);
      setStats({ matches: matches?.length ?? 0, messages: msgCount ?? 0 });
    })();
  }, [user]);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="text-sm text-muted-foreground">{t("home.greeting")}</div>
        <h1 className="font-display text-4xl sm:text-5xl font-medium mt-1.5">
          {t("home.title1")} <span className="text-gradient-coral">{t("home.title2")}</span>
        </h1>
      </motion.div>

      {/* Match bar — quick discover access */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-8 rounded-3xl border border-border/70 bg-card p-5 shadow-soft overflow-hidden relative"
      >
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-coral opacity-20 blur-3xl" />
        <div className="flex items-center justify-between mb-4 relative">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-coral" />
            <h2 className="font-display text-lg font-medium">{t("home.matchbar")}</h2>
          </div>
          <Link to="/app/discover" className="text-xs text-muted-foreground hover:text-foreground">
            {t("home.openDiscover")}
          </Link>
        </div>
        {people.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">
            <Link to="/app/discover" className="underline">{t("home.openDiscover")}</Link>
          </div>
        ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory relative">
          {people.map((p) => (
            <Link
              key={p.id}
              to="/app/discover"
              className="group relative shrink-0 snap-start w-32 sm:w-36 rounded-2xl overflow-hidden border border-border/60 bg-background hover:shadow-glow transition-all"
            >
              <div className="relative h-40 w-full">
                {p.photo ? (
                  <img src={p.photo} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0" style={{ background: p.color, opacity: 0.5 }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div
                  className="absolute top-2 right-2 text-[10px] uppercase tracking-widest rounded-full px-2 py-0.5 text-white backdrop-blur"
                  style={{ background: `color-mix(in oklab, ${p.color} 70%, transparent)` }}
                >
                  {p.strength}%
                </div>
                <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
                  <div className="text-sm font-medium leading-tight">{p.name}</div>
                </div>
              </div>
              <div className="flex items-center justify-around py-2 bg-card">
                <span className="h-7 w-7 rounded-full flex items-center justify-center bg-foreground/5 text-muted-foreground group-hover:text-foreground transition-colors">
                  <X className="h-3.5 w-3.5" />
                </span>
                <span className="h-7 w-7 rounded-full flex items-center justify-center bg-gradient-gold text-midnight">
                  <Star className="h-3.5 w-3.5" />
                </span>
                <span className="h-7 w-7 rounded-full flex items-center justify-center bg-gradient-coral text-white shadow-glow">
                  <Heart className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        )}
      </motion.section>

      <div className="mt-9 grid grid-cols-2 gap-4">
        <StatCard label={t("home.stat.bonds")} value={String(stats.matches)} hint={t("home.stat.bonds.hint")} />
        <StatCard label={t("home.stat.memories")} value={String(stats.messages)} hint={t("home.stat.memories.hint")} highlight />
      </div>

      {people.length > 0 && (
      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="font-display text-2xl font-medium">{t("home.people.title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("home.people.sub")}</p>
            </div>
            <Link to="/app/discover" className="text-sm text-muted-foreground hover:text-foreground">{t("home.people.cta")}</Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {people.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="group relative rounded-2xl border border-border/70 bg-card p-5 hover:shadow-soft transition-all overflow-hidden"
              >
                <div
                  className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
                  style={{ background: p.color }}
                />
                <div className="relative flex items-center gap-4">
                  {p.photo ? (
                    <img src={p.photo} alt={p.name} loading="lazy" className="h-12 w-12 rounded-full object-cover ring-2" style={{ boxShadow: `0 0 0 2px color-mix(in oklab, ${p.color} 30%, transparent)` }} />
                  ) : (
                    <div className="h-12 w-12 rounded-full" style={{ background: p.color, opacity: 0.5 }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.note}</div>
                  </div>
                </div>
                <div className="relative mt-5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                    <span>{t("home.bond.strength")}</span>
                    <span>{p.strength}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.strength}%`, background: p.color }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl p-6 bg-gradient-hero text-ivory shadow-elegant">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
              <Sparkles className="h-3.5 w-3.5" /> {t("home.ai.title")}
            </div>
            <p className="mt-4 font-display text-lg leading-snug">
              {t("home.ai.body")}
            </p>
            <div className="mt-5 flex gap-2">
              <Link to="/app/messages" className="rounded-full bg-ivory text-midnight text-xs px-3.5 py-2 font-medium">{t("home.ai.draft")}</Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-medium">{t("home.timeline.title")}</h3>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <ol className="space-y-4">
              {people.slice(0, 4).map((p) => (
                <li key={p.id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ background: p.color }} />
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.note}</div>
                    <div className="text-sm font-medium mt-0.5">{p.name}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
      )}
    </>
  );
}

function StatCard({ label, value, hint, highlight }: { label: string; value: string; hint: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border ${highlight ? "bg-gradient-gold border-transparent text-midnight" : "bg-card border-border/70"}`}>
      <div className="text-xs opacity-70">{label}</div>
      <div className="font-display text-3xl font-medium mt-1">{value}</div>
      <div className="text-[11px] opacity-70 mt-1">{hint}</div>
    </div>
  );
}