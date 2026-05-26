import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Crown, Infinity as InfinityIcon, Sparkles, Heart } from "lucide-react";
import { useLang } from "@/i18n";

export const Route = createFileRoute("/app/premium")({
  component: Premium,
});

import type { PlanTier } from "@/i18n/dictionaries";

type Tier = {
  tier: PlanTier;
  icon: typeof Sparkles;
  gradient: string;
  nameKey: string;
  taglineKey: string;
  featureKeys: string[];
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    tier: "free",
    nameKey: "premium.tier.free.name",
    taglineKey: "premium.tier.free.tagline",
    icon: Heart,
    gradient: "linear-gradient(135deg, #1f2937, #475569)",
    featureKeys: [
      "premium.feat.limitedLikes",
      "premium.feat.basicMatching",
      "premium.feat.basicMessages",
      "premium.feat.dailyPicks",
    ],
  },
  {
    tier: "plus",
    nameKey: "premium.tier.plus.name",
    taglineKey: "premium.tier.plus.tagline",
    icon: Sparkles,
    gradient: "linear-gradient(135deg, #69A7FF, #8B5CF6)",
    featureKeys: ["premium.feat.unlimitedLikes", "premium.feat.aiSuggestions", "premium.feat.advancedRecs", "premium.feat.readReceipts"],
  },
  {
    tier: "gold",
    nameKey: "premium.tier.gold.name",
    taglineKey: "premium.tier.gold.tagline",
    icon: Crown,
    gradient: "linear-gradient(135deg, #D6B36A, #FF7A8A)",
    featureKeys: ["premium.feat.everythingPlus", "premium.feat.priorityVisibility", "premium.feat.aiBoosts", "premium.feat.coupleSpaces", "premium.feat.memoryCapsules"],
    featured: true,
  },
  {
    tier: "infinity",
    nameKey: "premium.tier.infinity.name",
    taglineKey: "premium.tier.infinity.tagline",
    icon: InfinityIcon,
    gradient: "linear-gradient(135deg, #0F172A, #FF6B6B)",
    featureKeys: ["premium.feat.everythingGold", "premium.feat.profileOpt", "premium.feat.aiCoach", "premium.feat.travelMode", "premium.feat.concierge"],
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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.tier}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.7 }}
            className={`relative rounded-[2rem] p-7 overflow-hidden ${tier.featured ? "shadow-elegant scale-[1.02]" : "shadow-soft"}`}
            style={{ background: tier.gradient, color: "white" }}
          >
            {/* glow */}
            <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-white/30 blur-3xl" />
            {tier.featured && (
              <div className="absolute top-5 right-5 text-[10px] uppercase tracking-widest rounded-full bg-white/15 backdrop-blur px-2.5 py-1">
                {t("premium.most")}
              </div>
            )}
            <div className="relative">
              <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                <tier.icon className="h-5 w-5" />
              </div>
              <div className="mt-5 font-display text-3xl font-medium">{t(tier.nameKey)}</div>
              <div className="text-sm opacity-80">{t(tier.taglineKey)}</div>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-5xl">
                  {tier.tier === "free" ? t("premium.tier.free.price") : plan(tier.tier)}
                </span>
                {tier.tier !== "free" && (
                  <span className="text-sm opacity-70">{t("premium.month")}</span>
                )}
              </div>
              <ul className="mt-7 space-y-2.5 text-sm">
                {tier.featureKeys.map((fk) => (
                  <li key={fk} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 mt-0.5 opacity-90" />
                    <span>{t(fk)}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled={tier.tier === "free"}
                className="mt-8 w-full rounded-full bg-white text-midnight py-3 text-sm font-medium hover:opacity-95 transition-opacity disabled:opacity-70 disabled:cursor-default"
              >
                {tier.tier === "free" ? t("premium.current") : `${t("premium.choose")} ${t(tier.nameKey)}`}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">{t("premium.disclaimer")}</p>
    </div>
  );
}