import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import {
  Dumbbell, Plane, Sparkles, Mountain, Camera, Music2, Bike, Car, Waves,
  Leaf, PawPrint, Crown, Briefcase, PenTool, Megaphone, Globe2, Palette,
  Headphones, Glasses, BookOpen, GraduationCap, Heart, Flame,
  Coffee, Wine, Salad, Pizza, Tv, Code2, Brain, Mic, Tent, Star,
  ShieldCheck, BadgeCheck, Rocket, TrendingUp, Users, Home, Baby,
  Smile, Moon, Sun, Sprout, Church, Compass,
} from "lucide-react";
import { useLang } from "@/i18n";
import { identityHeader, tagLabel } from "@/i18n/identity-tags";

export const Route = createFileRoute("/app/identity")({
  component: Identity,
});

type Tag = { key: string; label: string; icon: any; color: string };

const C = {
  rose: "var(--color-romantic)",
  gold: "var(--color-gold)",
  blue: "var(--color-friends)",
  green: "var(--color-pro)",
  violet: "var(--color-inner)",
  amber: "var(--color-family)",
  coral: "var(--color-coral)",
  memory: "var(--color-memory)",
};

const sections: { key: string; titleKey: string; tags: Tag[] }[] = [
  {
    key: "lifestyle",
    titleKey: "identity.category.lifestyle",
    tags: [
      { key: "gym", label: "Gym People", icon: Dumbbell, color: C.coral },
      { key: "athletes", label: "Athletes", icon: Flame, color: C.coral },
      { key: "travelers", label: "Travelers", icon: Plane, color: C.blue },
      { key: "luxury", label: "Luxury Lifestyle", icon: Crown, color: C.gold },
      { key: "minimalists", label: "Minimalists", icon: Sparkles, color: C.violet },
      { key: "entrepreneurs", label: "Entrepreneurs", icon: Briefcase, color: C.green },
      { key: "creators", label: "Creators", icon: PenTool, color: C.amber },
      { key: "influencers", label: "Influencers", icon: Megaphone, color: C.rose },
      { key: "nomads", label: "Digital Nomads", icon: Globe2, color: C.blue },
      { key: "artists", label: "Artists", icon: Palette, color: C.violet },
      { key: "musicians", label: "Musicians", icon: Music2, color: C.violet },
      { key: "fashion", label: "Fashion Lovers", icon: Sparkles, color: C.rose },
      { key: "moto", label: "Motorcycle Riders", icon: Bike, color: C.coral },
      { key: "cars", label: "Car Enthusiasts", icon: Car, color: C.amber },
      { key: "beach", label: "Beach Lifestyle", icon: Waves, color: C.blue },
      { key: "nature", label: "Nature Lovers", icon: Leaf, color: C.green },
      { key: "pets", label: "Pet Lovers", icon: PawPrint, color: C.amber },
    ],
  },
  {
    key: "personality",
    titleKey: "identity.category.personality",
    tags: [
      { key: "goth", label: "Goth", icon: Moon, color: C.violet },
      { key: "nerd", label: "Nerd", icon: Glasses, color: C.blue },
      { key: "geek", label: "Geek", icon: Code2, color: C.green },
      { key: "academic", label: "Academic", icon: BookOpen, color: C.gold },
      { key: "students", label: "University Students", icon: GraduationCap, color: C.blue },
      { key: "introvert", label: "Introvert", icon: Moon, color: C.violet },
      { key: "extrovert", label: "Extrovert", icon: Sun, color: C.coral },
      { key: "romantic", label: "Romantic", icon: Heart, color: C.rose },
      { key: "intellectual", label: "Intellectual", icon: Brain, color: C.gold },
      { key: "spiritual", label: "Spiritual", icon: Sparkles, color: C.violet },
      { key: "alternative", label: "Alternative", icon: Flame, color: C.coral },
      { key: "traditional", label: "Traditional", icon: Home, color: C.amber },
      { key: "ambitious", label: "Ambitious", icon: Rocket, color: C.green },
      { key: "homeoriented", label: "Home Oriented", icon: Baby, color: C.amber },
      { key: "quiet", label: "Quiet People", icon: Smile, color: C.blue },
      { key: "party", label: "Party People", icon: Sparkles, color: C.coral },
    ],
  },
  {
    key: "belief",
    titleKey: "identity.category.belief",
    tags: [
      { key: "christian", label: "Christian", icon: Church, color: C.gold },
      { key: "catholic", label: "Catholic", icon: Church, color: C.gold },
      { key: "evangelical", label: "Evangelical", icon: Church, color: C.amber },
      { key: "muslim", label: "Muslim", icon: Sparkles, color: C.green },
      { key: "jewish", label: "Jewish", icon: Star, color: C.blue },
      { key: "buddhist", label: "Buddhist", icon: Sprout, color: C.green },
      { key: "spiritualism", label: "Spiritual", icon: Sparkles, color: C.violet },
      { key: "astrology", label: "Astrology / Zodiac", icon: Star, color: C.violet },
      { key: "atheist", label: "Atheist", icon: Compass, color: C.blue },
      { key: "agnostic", label: "Agnostic", icon: Compass, color: C.memory },
    ],
  },
  {
    key: "orientation",
    titleKey: "identity.category.orientation",
    tags: [
      { key: "friendship", label: "Friendship", icon: Users, color: C.blue },
      { key: "longterm", label: "Long-Term Relationship", icon: Heart, color: C.rose },
      { key: "casual", label: "Casual Dating", icon: Sparkles, color: C.coral },
      { key: "marriage", label: "Marriage Focused", icon: BadgeCheck, color: C.gold },
      { key: "networking", label: "Networking", icon: Briefcase, color: C.green },
      { key: "closecircle", label: "Close Circle", icon: Home, color: C.amber },
      { key: "community", label: "Community", icon: Users, color: C.violet },
    ],
  },
  {
    key: "identity-incl",
    titleKey: "identity.category.identity",
    tags: [
      { key: "lgbtqia", label: "LGBTQIA+", icon: Heart, color: C.violet },
      { key: "hetero", label: "Heterosexual", icon: Heart, color: C.rose },
      { key: "bi", label: "Bisexual", icon: Heart, color: C.coral },
      { key: "gay", label: "Gay", icon: Heart, color: C.blue },
      { key: "lesbian", label: "Lesbian", icon: Heart, color: C.rose },
      { key: "nb", label: "Non-binary", icon: Sparkles, color: C.gold },
      { key: "trans", label: "Transgender", icon: Sparkles, color: C.violet },
    ],
  },
  {
    key: "hobbies",
    titleKey: "identity.category.hobbies",
    tags: [
      { key: "gaming", label: "Gaming", icon: Tv, color: C.violet },
      { key: "anime", label: "Anime", icon: Sparkles, color: C.rose },
      { key: "tech", label: "Technology", icon: Code2, color: C.blue },
      { key: "books", label: "Books", icon: BookOpen, color: C.gold },
      { key: "cooking", label: "Cooking", icon: Salad, color: C.green },
      { key: "photo", label: "Photography", icon: Camera, color: C.amber },
      { key: "fitness", label: "Fitness", icon: Dumbbell, color: C.coral },
      { key: "cinema", label: "Cinema", icon: Tv, color: C.violet },
      { key: "music", label: "Music", icon: Music2, color: C.rose },
      { key: "dance", label: "Dance", icon: Sparkles, color: C.coral },
      { key: "hiking", label: "Hiking", icon: Mountain, color: C.green },
      { key: "meditation", label: "Meditation", icon: Sprout, color: C.green },
      { key: "investing", label: "Investing", icon: TrendingUp, color: C.gold },
      { key: "startups", label: "Startups", icon: Rocket, color: C.coral },
      { key: "ai", label: "Artificial Intelligence", icon: Brain, color: C.violet },
      { key: "content", label: "Content Creation", icon: PenTool, color: C.amber },
      { key: "podcasts", label: "Podcasts", icon: Mic, color: C.blue },
      { key: "camping", label: "Camping", icon: Tent, color: C.green },
    ],
  },
  {
    key: "food",
    titleKey: "identity.category.food",
    tags: [
      { key: "vegan", label: "Vegan", icon: Leaf, color: C.green },
      { key: "vegetarian", label: "Vegetarian", icon: Salad, color: C.green },
      { key: "healthy", label: "Healthy Lifestyle", icon: Sprout, color: C.green },
      { key: "coffee", label: "Coffee Lovers", icon: Coffee, color: C.amber },
      { key: "wine", label: "Wine Lovers", icon: Wine, color: C.rose },
      { key: "foodies", label: "Foodies", icon: Pizza, color: C.coral },
    ],
  },
  {
    key: "social",
    titleKey: "identity.category.social",
    tags: [
      { key: "middle", label: "Middle Class", icon: Users, color: C.blue },
      { key: "high", label: "High Class", icon: Crown, color: C.gold },
      { key: "luxe", label: "Luxury Lifestyle", icon: Sparkles, color: C.gold },
      { key: "founders", label: "Startup Founders", icon: Rocket, color: C.coral },
      { key: "ceos", label: "CEOs", icon: ShieldCheck, color: C.green },
      { key: "studs", label: "Students", icon: GraduationCap, color: C.blue },
      { key: "pros", label: "Professionals", icon: Briefcase, color: C.green },
      { key: "investors", label: "Investors", icon: TrendingUp, color: C.gold },
    ],
  },
  {
    key: "gen",
    titleKey: "identity.category.generation",
    tags: [
      { key: "ya", label: "Young Adults", icon: Sparkles, color: C.coral },
      { key: "millennial", label: "Millennials", icon: Headphones, color: C.violet },
      { key: "genz", label: "Gen Z", icon: Flame, color: C.rose },
      { key: "mature", label: "Mature Adults", icon: BadgeCheck, color: C.amber },
      { key: "seniors", label: "Seniors", icon: Sun, color: C.gold },
    ],
  },
];

function Identity() {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["travelers", "minimalists", "books", "coffee", "intellectual"]));

  const toggle = (key: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const total = useMemo(() => sections.reduce((a, s) => a + s.tags.length, 0), []);

  return (
    <div className="pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{identityHeader[lang]}</div>
          <h1 className="font-display text-3xl sm:text-4xl font-medium mt-2 max-w-2xl leading-tight">
            {t("identity.title")}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl">{t("identity.subtitle")}</p>
        </div>
        <div className="rounded-2xl glass px-5 py-4 text-right">
          <div className="font-display text-3xl">{selected.size}<span className="text-muted-foreground text-base"> / {total}</span></div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5">{t("identity.selected")}</div>
        </div>
      </div>

      <div className="space-y-10">
        {sections.map((sec) => (
          <section key={sec.key}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-display text-xl font-medium">{t(sec.titleKey)}</h2>
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                {sec.tags.filter((tg) => selected.has(tg.key)).length} / {sec.tags.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {sec.tags.map((tag) => {
                const active = selected.has(tag.key);
                return (
                  <motion.button
                    key={tag.key}
                    onClick={() => toggle(tag.key)}
                    whileTap={{ scale: 0.94 }}
                    whileHover={{ y: -2 }}
                    className={`group relative inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all ${
                      active
                        ? "border-transparent text-white shadow-soft"
                        : "border-border bg-card text-foreground/80 hover:border-foreground/30 hover:text-foreground"
                    }`}
                    style={active ? {
                      background: `linear-gradient(135deg, ${tag.color}, color-mix(in oklab, ${tag.color} 60%, black))`,
                    } : undefined}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${active ? "bg-white/20" : ""}`}
                      style={!active ? { background: `color-mix(in oklab, ${tag.color} 18%, transparent)`, color: tag.color } : undefined}
                    >
                      <tag.icon className="h-3 w-3" strokeWidth={2.25} />
                    </span>
                    {tagLabel(tag.key, lang, tag.label)}
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="ml-0.5 h-1.5 w-1.5 rounded-full bg-white"
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Sticky save */}
      <div className="fixed lg:sticky bottom-20 lg:bottom-6 inset-x-4 lg:inset-x-auto lg:right-10 lg:left-auto mt-10 z-30 lg:max-w-md lg:ml-auto">
        <div className="rounded-full glass shadow-elegant flex items-center justify-between gap-4 p-1.5 pl-5">
          <div className="text-xs">
            <span className="font-medium">{selected.size}</span>{" "}
            <span className="text-muted-foreground">{t("identity.selected")}</span>
          </div>
          <button className="rounded-full bg-gradient-coral text-white text-sm px-5 py-2.5 font-medium shadow-glow">
            {t("identity.continue")}
          </button>
        </div>
      </div>
    </div>
  );
}