import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Crown, Infinity as InfinityIcon, Sparkles } from "lucide-react";
import { useLang } from "@/i18n";

export const Route = createFileRoute("/app/premium")({
  component: Premium,
});

import type { PlanTier } from "@/i18n/dictionaries";

type Tier = {
  name: string;
  tier: PlanTier;
  tagline: string;
  icon: typeof Sparkles;
  gradient: string;
  features: string[];
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Bond Plus",
    tier: "plus",
    tagline: "Begin the intentional life.",
    icon: Sparkles,
    gradient: "linear-gradient(135deg, #69A7FF, #8B5CF6)",
    features: ["Unlimited likes", "AI conversation suggestions", "Advanced recommendations", "Read receipts"],
  },
  {
    name: "Bond Gold",
    tier: "gold",
    tagline: "For the emotionally serious.",
    icon: Crown,
    gradient: "linear-gradient(135deg, #D6B36A, #FF7A8A)",
    features: ["Everything in Plus", "Priority visibility", "AI compatibility boosts", "Couple spaces", "Memory capsules"],
    featured: true,
  },
  {
    name: "Bond Infinity",
    tier: "infinity",
    tagline: "A life of curated connection.",
    icon: InfinityIcon,
    gradient: "linear-gradient(135deg, #0F172A, #FF6B6B)",
    features: ["Everything in Gold", "Profile optimization", "Personal AI relationship coach", "Travel & global mode", "Concierge introductions"],
  },
];

function Premium() {
  const { t, plan } = useLang();
  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground mb-5">
          <Crown className="h-3 w-3" /> {t("premium.badge")}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-medium leading-tight">
          {t("premium.h1a")} <span className="text-gradient-coral">{t("premium.h1b")}</span> {t("premium.h1c")}
        </h1>
        <p className="mt-5 text-muted-foreground">
          {t("premium.sub")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {tiers.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.7 }}
            className={`relative rounded-[2rem] p-7 overflow-hidden ${t.featured ? "shadow-elegant scale-[1.02]" : "shadow-soft"}`}
            style={{ background: t.gradient, color: "white" }}
          >
            {/* glow */}
            <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-white/30 blur-3xl" />
            {t.featured && (
              <div className="absolute top-5 right-5 text-[10px] uppercase tracking-widest rounded-full bg-white/15 backdrop-blur px-2.5 py-1">
                {t.featured ? "Most loved" : ""}
              </div>
            )}
            <div className="relative">
              <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                <t.icon className="h-5 w-5" />
              </div>
              <div className="mt-5 font-display text-3xl font-medium">{t.name}</div>
              <div className="text-sm opacity-80">{t.tagline}</div>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-5xl">{plan(t.tier)}</span>
                <span className="text-sm opacity-70">/ month</span>
              </div>
              <ul className="mt-7 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 mt-0.5 opacity-90" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-full bg-white text-midnight py-3 text-sm font-medium hover:opacity-95 transition-opacity">
                Choose {t.name.split(" ")[1]}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">{t("premium.disclaimer")}</p>
    </div>
  );
}