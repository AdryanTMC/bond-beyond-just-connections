import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Heart, Users, Sparkles, Clock, MapPin, Lock, Bell,
  ArrowRight, Check, Globe, MessageCircleHeart, Infinity as InfinityIcon,
} from "lucide-react";
import heroImg from "@/assets/hero-bond.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bond — Relationships that stay." },
      { name: "description", content: "The social layer for real human connections. Preserve memories, nurture circles, never lose touch with the people who matter." },
      { property: "og:title", content: "Bond — Relationships that stay." },
      { property: "og:description", content: "The social layer for real human connections." },
    ],
  }),
  component: Landing,
});

const categories = [
  { name: "Romantic", color: "var(--color-romantic)", desc: "Love & intimacy" },
  { name: "Family", color: "var(--color-family)", desc: "Home & warmth" },
  { name: "Friendships", color: "var(--color-friends)", desc: "Trust & lightness" },
  { name: "Professional", color: "var(--color-pro)", desc: "Growth & opportunity" },
  { name: "Inner Circle", color: "var(--color-inner)", desc: "Rare & exclusive" },
  { name: "Memories", color: "var(--color-memory)", desc: "Timeless & preserved" },
];

const features = [
  { icon: Clock, title: "Relationship Timeline", body: "Memories, photos, voice notes and milestones — woven into a living timeline for every person who matters." },
  { icon: Users, title: "Inner Circles", body: "Private spaces for family, couples, and your closest friends. Calm, intimate, ad-free." },
  { icon: Sparkles, title: "AI Relationship Assistant", body: "Gentle reminders, thoughtful nudges, and emotional message drafts — so no one is forgotten." },
  { icon: Lock, title: "Memory Capsules", body: "Time-locked messages, anniversaries, and emotional archives sent to your future self or loved ones." },
  { icon: MapPin, title: "Relationship Map", body: "See your strongest bonds, circles, and the natural evolution of your human network." },
  { icon: Bell, title: "Emotionally Smart Notifications", body: "‘You haven’t spoken to Sarah in 42 days.’ Soft signals, never noise." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader />

      {/* HERO */}
      <section className="relative min-h-[100vh] flex items-center pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" width={1920} height={1080} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground mb-7">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-coral animate-pulse" />
              Bond · Laço — now in private beta
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.02] tracking-tight">
              Relationships <br />
              <span className="text-gradient-coral">that stay.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Bond is the social layer for real human connections. Preserve memories, nurture your inner circles,
              and never lose touch with the people who matter most.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/app"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3.5 text-sm font-medium hover:opacity-90 transition-all"
              >
                Begin your bonds
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium">
                Discover the platform
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> EN · PT-BR · ES · FR</span>
              <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Private by design</span>
              <span className="inline-flex items-center gap-1.5"><InfinityIcon className="h-3.5 w-3.5" /> Memories for life</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <FloatingCard />
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="circles" className="py-28 bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Six worlds, one platform</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-medium">
              Every relationship has its own emotional color.
            </h2>
            <p className="mt-5 text-muted-foreground text-lg">
              Bond organizes your human network into six living categories — each with its own identity, rituals, and rhythm.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-5">
            {categories.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="group relative rounded-3xl bg-card p-7 shadow-soft hover:shadow-elegant transition-all overflow-hidden"
              >
                <div
                  className="absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-30 blur-3xl group-hover:opacity-60 transition-opacity"
                  style={{ background: c.color }}
                />
                <div className="relative">
                  <div
                    className="h-10 w-10 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `color-mix(in oklab, ${c.color} 18%, transparent)` }}
                  >
                    <span className="h-3.5 w-3.5 rounded-full" style={{ background: c.color }} />
                  </div>
                  <div className="font-display text-xl font-medium">{c.name}</div>
                  <div className="mt-1.5 text-sm text-muted-foreground">{c.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">The continuity layer</span>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-medium">
                Tinder solves discovery. <br />
                <span className="text-gradient-gold">Bond solves continuity.</span>
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              The longer you live inside Bond, the more emotionally valuable it becomes. Your memories are the product.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="rounded-3xl border border-border/70 bg-card p-7 hover:border-foreground/20 hover:shadow-soft transition-all"
              >
                <div className="h-11 w-11 rounded-2xl bg-foreground/5 flex items-center justify-center mb-5">
                  <f.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="font-display text-xl font-medium">{f.title}</div>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE / EMOTIONAL BAND */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero -z-10" />
        <div className="absolute inset-0 -z-10 opacity-30"
             style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, white 0.5px, transparent 1px)", backgroundSize: "60px 60px, 90px 90px" }} />
        <div className="mx-auto max-w-4xl px-6 text-center text-ivory">
          <MessageCircleHeart className="h-10 w-10 mx-auto mb-6 opacity-80" strokeWidth={1.5} />
          <p className="font-display text-3xl sm:text-5xl leading-tight font-medium">
            “This is where my real relationships live now. Not in a feed — in a place that remembers.”
          </p>
          <p className="mt-6 text-sm tracking-widest uppercase opacity-70">Bond · Early member, São Paulo</p>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Plans</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-medium">Built to grow with you.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <PriceCard
              tier="Free"
              price="$0"
              tagline="Begin your bonds"
              features={["Up to 25 relationships", "Basic timelines", "1 inner circle", "Smart reminders"]}
            />
            <PriceCard
              tier="Premium"
              price="$9"
              tagline="For the emotionally intentional"
              featured
              features={["Unlimited relationships & memories", "AI Relationship Assistant", "Memory Capsules", "Emotional analytics", "Custom themes"]}
            />
            <PriceCard
              tier="Organizations"
              price="Custom"
              tagline="Culture & community at scale"
              features={["Private internal communities", "Team bonding rituals", "Culture analytics", "SSO & admin"]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative rounded-[2.5rem] overflow-hidden p-12 sm:p-16 text-center text-ivory bg-gradient-hero shadow-elegant">
            <h3 className="font-display text-4xl sm:text-5xl font-medium leading-tight">
              The people who matter <br /> deserve a place that remembers.
            </h3>
            <Link
              to="/app"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-ivory text-midnight px-7 py-4 text-sm font-medium hover:opacity-95 transition-opacity"
            >
              Enter Bond
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FloatingCard() {
  const items = [
    { name: "Mom", note: "3 years since the trip to Bahia", color: "var(--color-family)" },
    { name: "Sarah", note: "Birthday in 4 days", color: "var(--color-friends)" },
    { name: "Lucas", note: "Capsule unlocks tomorrow", color: "var(--color-memory)" },
  ];
  return (
    <div className="relative mx-auto max-w-md">
      <div className="absolute -inset-10 bg-gradient-coral opacity-30 blur-3xl rounded-full -z-10" />
      <div className="glass-dark rounded-3xl p-6 shadow-elegant text-ivory">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs uppercase tracking-widest opacity-60">Today</div>
            <div className="font-display text-2xl mt-1">Your bonds</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-coral flex items-center justify-center">
            <Heart className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-3">
          {items.map((it, i) => (
            <motion.div
              key={it.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.7 }}
              className="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 p-3.5"
            >
              <div className="h-10 w-10 rounded-full flex items-center justify-center font-display text-base"
                   style={{ background: `color-mix(in oklab, ${it.color} 30%, transparent)` }}>
                {it.name[0]}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{it.name}</div>
                <div className="text-xs opacity-70">{it.note}</div>
              </div>
              <span className="h-2 w-2 rounded-full" style={{ background: it.color }} />
            </motion.div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="text-xs opacity-70">AI Assistant</div>
          <div className="text-sm mt-1.5 leading-relaxed">
            “You haven’t spoken to your sister in 38 days. Want me to draft a soft hello?”
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceCard({
  tier, price, tagline, features, featured,
}: { tier: string; price: string; tagline: string; features: string[]; featured?: boolean }) {
  return (
    <div className={`relative rounded-3xl p-8 transition-all ${
      featured ? "bg-foreground text-background shadow-elegant scale-[1.02]" : "bg-card border border-border/70 shadow-soft"
    }`}>
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-coral px-3 py-1 text-[10px] uppercase tracking-widest text-white">
          Most loved
        </span>
      )}
      <div className="text-sm opacity-80">{tier}</div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-medium">{price}</span>
        {price !== "Custom" && <span className="text-sm opacity-60">/ month</span>}
      </div>
      <div className="mt-1.5 text-sm opacity-70">{tagline}</div>
      <ul className="mt-7 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="h-4 w-4 mt-0.5 opacity-70" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button className={`mt-8 w-full rounded-full py-3 text-sm font-medium transition-opacity hover:opacity-90 ${
        featured ? "bg-background text-foreground" : "bg-foreground text-background"
      }`}>
        {tier === "Organizations" ? "Talk to us" : "Choose " + tier}
      </button>
    </div>
  );
}
