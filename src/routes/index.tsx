import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Heart, Users, Sparkles, Clock, MapPin, Lock, Bell,
  ArrowRight, Check, MessageCircleHeart,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CinematicHero } from "@/components/cinematic-hero";
import { FloatingCharms } from "@/components/floating-charms";
import { useLang } from "@/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bond · Capture page — Relationships that stay." },
      { name: "description", content: "Lead capture page · join the Bond waitlist. The social layer for real human connections." },
      { property: "og:title", content: "Bond · Capture page" },
      { property: "og:description", content: "The social layer for real human connections." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t, price } = useLang();
  const categories = [
    { name: t("landing.cat.romantic"), color: "var(--color-romantic)", desc: t("landing.cat.romantic.desc") },
    { name: t("landing.cat.friendships"), color: "var(--color-friends)", desc: t("landing.cat.friendships.desc") },
    { name: t("landing.cat.community"), color: "var(--color-family)", desc: t("landing.cat.community.desc") },
    { name: t("landing.cat.professional"), color: "var(--color-pro)", desc: t("landing.cat.professional.desc") },
    { name: t("landing.cat.inner"), color: "var(--color-inner)", desc: t("landing.cat.inner.desc") },
    { name: t("landing.cat.memories"), color: "var(--color-memory)", desc: t("landing.cat.memories.desc") },
  ];
  const features = [
    { icon: Clock, title: t("landing.f1.t"), body: t("landing.f1.b") },
    { icon: Users, title: t("landing.f2.t"), body: t("landing.f2.b") },
    { icon: Sparkles, title: t("landing.f3.t"), body: t("landing.f3.b") },
    { icon: Lock, title: t("landing.f4.t"), body: t("landing.f4.b") },
    { icon: MapPin, title: t("landing.f5.t"), body: t("landing.f5.b") },
    { icon: Bell, title: t("landing.f6.t"), body: t("landing.f6.b") },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader />
      <CinematicHero />

      {/* CATEGORIES */}
      <section id="circles" className="relative py-28 bg-gradient-soft overflow-hidden">
        <FloatingCharms count={10} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("landing.categories.eyebrow")}</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-medium">
              {t("landing.categories.title")}
            </h2>
            <p className="mt-5 text-muted-foreground text-lg">
              {t("landing.categories.body")}
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
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("landing.features.eyebrow")}</span>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-medium">
                {t("landing.features.title1")} <br />
                <span className="text-gradient-gold">{t("landing.features.title2")}</span>
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              {t("landing.features.body")}
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
            {t("landing.quote")}
          </p>
          <p className="mt-6 text-sm tracking-widest uppercase opacity-70">{t("landing.quote.cite")}</p>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative py-28 overflow-hidden">
        <FloatingCharms count={8} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("landing.pricing.eyebrow")}</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-medium">{t("landing.pricing.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <PriceCard
              tier={t("landing.price.free")}
              price={price(0)}
              tagline={t("landing.price.free.tag")}
              features={[t("landing.free.1"), t("landing.free.2"), t("landing.free.3"), t("landing.free.4")]}
              monthLabel={t("landing.price.month")}
              chooseLabel={t("landing.price.choose")}
            />
            <PriceCard
              tier={t("landing.price.premium")}
              price={price(9)}
              tagline={t("landing.price.premium.tag")}
              featured
              features={[t("landing.prem.1"), t("landing.prem.2"), t("landing.prem.3"), t("landing.prem.4"), t("landing.prem.5")]}
              monthLabel={t("landing.price.month")}
              chooseLabel={t("landing.price.choose")}
              mostLoved={t("landing.price.mostLoved")}
            />
            <PriceCard
              tier={t("landing.price.org")}
              price={t("landing.price.custom")}
              tagline={t("landing.price.org.tag")}
              features={[t("landing.org.1"), t("landing.org.2"), t("landing.org.3"), t("landing.org.4")]}
              monthLabel={t("landing.price.month")}
              chooseLabel={t("landing.price.talk")}
              isCustom
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden">
        <FloatingCharms count={10} />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="relative rounded-[2.5rem] overflow-hidden p-12 sm:p-16 text-center text-ivory bg-gradient-hero shadow-elegant">
            <h3 className="font-display text-4xl sm:text-5xl font-medium leading-tight">
              {t("landing.cta.title1")} <br /> {t("landing.cta.title2")}
            </h3>
            <Link
              to="/app"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-ivory text-midnight px-7 py-4 text-sm font-medium hover:opacity-95 transition-opacity"
            >
              {t("landing.cta.button")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function PriceCard({
  tier, price, tagline, features, featured, monthLabel, chooseLabel, mostLoved, isCustom,
}: { tier: string; price: string; tagline: string; features: string[]; featured?: boolean; monthLabel: string; chooseLabel: string; mostLoved?: string; isCustom?: boolean }) {
  return (
    <div className={`relative rounded-3xl p-8 transition-all ${
      featured ? "bg-foreground text-background shadow-elegant scale-[1.02]" : "bg-card border border-border/70 shadow-soft"
    }`}>
      {featured && mostLoved && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-coral px-3 py-1 text-[10px] uppercase tracking-widest text-white">
          {mostLoved}
        </span>
      )}
      <div className="text-sm opacity-80">{tier}</div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-medium">{price}</span>
        {!isCustom && <span className="text-sm opacity-60">{monthLabel}</span>}
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
        {chooseLabel} {!isCustom && tier}
      </button>
    </div>
  );
}
