import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Crown, Infinity as InfinityIcon, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/premium")({
  component: Premium,
});

const tiers = [
  {
    name: "Bond Plus",
    price: "$9",
    tagline: "Begin the intentional life.",
    icon: Sparkles,
    gradient: "linear-gradient(135deg, #69A7FF, #8B5CF6)",
    features: ["Unlimited likes", "AI conversation suggestions", "Advanced recommendations", "Read receipts"],
  },
  {
    name: "Bond Gold",
    price: "$19",
    tagline: "For the emotionally serious.",
    icon: Crown,
    gradient: "linear-gradient(135deg, #D6B36A, #FF7A8A)",
    features: ["Everything in Plus", "Priority visibility", "AI compatibility boosts", "Couple spaces", "Memory capsules"],
    featured: true,
  },
  {
    name: "Bond Infinity",
    price: "$39",
    tagline: "A life of curated connection.",
    icon: InfinityIcon,
    gradient: "linear-gradient(135deg, #0F172A, #FF6B6B)",
    features: ["Everything in Gold", "Profile optimization", "Personal AI relationship coach", "Travel & global mode", "Concierge introductions"],
  },
];

function Premium() {
  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground mb-5">
          <Crown className="h-3 w-3" /> Premium
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-medium leading-tight">
          A platform that grows <span className="text-gradient-coral">emotionally</span> with you.
        </h1>
        <p className="mt-5 text-muted-foreground">
          Bond's premium tiers are not features. They're rituals — designed to deepen the relationships you already cherish.
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
                Most loved
              </div>
            )}
            <div className="relative">
              <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                <t.icon className="h-5 w-5" />
              </div>
              <div className="mt-5 font-display text-3xl font-medium">{t.name}</div>
              <div className="text-sm opacity-80">{t.tagline}</div>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-5xl">{t.price}</span>
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

      <p className="mt-10 text-center text-xs text-muted-foreground">
        Cancel anytime · Refunded within 14 days · Memories you create are yours forever.
      </p>
    </div>
  );
}