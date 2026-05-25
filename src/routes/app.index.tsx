import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sparkles, Clock, Heart, X, Star, Flame } from "lucide-react";
import { useLang } from "@/i18n";
import marianaImg from "@/assets/person-mariana.jpg";
import lucasImg from "@/assets/person-lucas.jpg";
import sofiaImg from "@/assets/person-sofia.jpg";
import danielImg from "@/assets/person-daniel.jpg";
import yumiImg from "@/assets/person-yumi.jpg";
import theoImg from "@/assets/person-theo.jpg";
import sceneRomance from "@/assets/scene-romance-evening.jpg";
import sceneFriends from "@/assets/scene-friends-rooftop.jpg";
import sceneNetworking from "@/assets/scene-networking-cafe.jpg";
import sceneCommunity from "@/assets/scene-community-dinner.jpg";
import sceneMemory from "@/assets/scene-memory-polaroid.jpg";

export const Route = createFileRoute("/app/")({
  component: AppHome,
});

const people = [
  { name: "Mariana", note: "Last memory · 12 days ago", color: "var(--color-romantic)", strength: 96, photo: marianaImg },
  { name: "Yumi", note: "Sent you a voice note", color: "var(--color-inner)", strength: 88, photo: yumiImg },
  { name: "Sarah", note: "You haven't talked in 42 days", color: "var(--color-friends)", strength: 54, photo: sofiaImg },
  { name: "Lucas", note: "Shared a new memory", color: "var(--color-inner)", strength: 91, photo: lucasImg },
  { name: "Théo", note: "3-year friendship anniversary today", color: "var(--color-memory)", strength: 72, photo: theoImg },
  { name: "Daniel", note: "Capsule unlocks in 9 days", color: "var(--color-pro)", strength: 60, photo: danielImg },
];

const timeline = [
  { when: "Today", title: "Anniversary unlocked", body: "3 years since your trip to Lisbon with Mariana.", color: "var(--color-romantic)" },
  { when: "Yesterday", title: "Yumi shared a memory", body: "A photo from your last city walk.", color: "var(--color-inner)" },
  { when: "2 days ago", title: "Capsule sealed", body: "A voice note for Lucas, unlocks in 1 year.", color: "var(--color-memory)" },
  { when: "Last week", title: "New bond", body: "You added Daniel to your Work circle.", color: "var(--color-pro)" },
];

function AppHome() {
  const { t } = useLang();
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
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory relative">
          {people.map((p) => (
            <Link
              key={p.name}
              to="/app/discover"
              className="group relative shrink-0 snap-start w-32 sm:w-36 rounded-2xl overflow-hidden border border-border/60 bg-background hover:shadow-glow transition-all"
            >
              <div className="relative h-40 w-full">
                <img src={p.photo} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
      </motion.section>

      <div className="mt-9 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t("home.stat.bonds")} value="52" hint={t("home.stat.bonds.hint")} />
        <StatCard label={t("home.stat.memories")} value="284" hint={t("home.stat.memories.hint")} />
        <StatCard label={t("home.stat.capsules")} value="7" hint={t("home.stat.capsules.hint")} />
        <StatCard label={t("home.stat.health")} value="84" hint={t("home.stat.health.hint")} highlight />
      </div>

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
                key={p.name}
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
                  <img
                    src={p.photo}
                    alt={p.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover ring-2"
                    style={{ boxShadow: `0 0 0 2px color-mix(in oklab, ${p.color} 30%, transparent)` }}
                  />
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
              <button className="rounded-full bg-ivory text-midnight text-xs px-3.5 py-2 font-medium">{t("home.ai.draft")}</button>
              <button className="rounded-full bg-white/10 border border-white/15 text-xs px-3.5 py-2 font-medium">{t("home.ai.later")}</button>
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-medium">{t("home.timeline.title")}</h3>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <ol className="space-y-4">
              {timeline.map((t) => (
                <li key={t.title} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ background: t.color }} />
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{t.when}</div>
                    <div className="text-sm font-medium mt-0.5">{t.title}</div>
                    <div className="text-xs text-muted-foreground">{t.body}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      {/* Demo gallery — visual moments across all bond categories */}
      <section className="mt-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl font-medium">{t("home.moments")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("home.moments.sub")}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { src: sceneRomance, label: t("discover.intent.romance"), tone: "var(--color-romantic)" },
            { src: sceneFriends, label: t("discover.intent.friendship"), tone: "var(--color-friends)" },
            { src: sceneNetworking, label: t("discover.intent.networking"), tone: "var(--color-pro)" },
            { src: sceneCommunity, label: t("discover.intent.community"), tone: "var(--color-family)" },
            { src: sceneMemory, label: t("landing.cat.memories"), tone: "var(--color-memory)" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border/60 shadow-soft"
            >
              <img src={s.src} alt={s.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <span
                  className="text-[10px] uppercase tracking-widest rounded-full px-2 py-0.5 backdrop-blur"
                  style={{ background: `color-mix(in oklab, ${s.tone} 70%, transparent)` }}
                >
                  {s.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
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