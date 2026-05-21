import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { useMemo, useState } from "react";
import { Heart, X, Star, MapPin, Sparkles, Users, Briefcase, Home } from "lucide-react";
import { useLang } from "@/i18n";

export const Route = createFileRoute("/app/discover")({
  component: Discover,
});

const intentions = [
  { key: "romance", labelKey: "discover.intent.romance", icon: Heart, color: "var(--color-romantic)" },
  { key: "friendship", labelKey: "discover.intent.friendship", icon: Users, color: "var(--color-friends)" },
  { key: "networking", labelKey: "discover.intent.networking", icon: Briefcase, color: "var(--color-pro)" },
  { key: "community", labelKey: "discover.intent.community", icon: Home, color: "var(--color-family)" },
] as const;

type Person = {
  name: string; age: number; city: string; distance: string;
  bio: string; interests: string[]; compatibility: number; depth: number;
  gradient: string;
};

const cards: Person[] = [
  { name: "Mariana", age: 28, city: "Lisbon", distance: "2 km away",
    bio: "Architect, slow mornings, vinyl, candlelit dinners. Believes that paying attention is the highest form of love.",
    interests: ["Architecture", "Vinyl", "Travel", "Cooking"], compatibility: 94, depth: 86,
    gradient: "linear-gradient(135deg, #FF7A8A, #D6B36A)" },
  { name: "Lucas", age: 31, city: "São Paulo", distance: "5 km away",
    bio: "Founder · climbing · quiet introvert that lights up with the right people. Building a life that doesn't need a vacation from itself.",
    interests: ["Startups", "Climbing", "Books", "Espresso"], compatibility: 88, depth: 79,
    gradient: "linear-gradient(135deg, #69A7FF, #8B5CF6)" },
  { name: "Sofia", age: 26, city: "Barcelona", distance: "Travel mode · ES",
    bio: "Filmmaker capturing real moments. Family is religion. Looking for friendships that feel like home.",
    interests: ["Cinema", "Family", "Sunsets", "Slow food"], compatibility: 91, depth: 92,
    gradient: "linear-gradient(135deg, #F4B860, #FF7A8A)" },
  { name: "Théo", age: 33, city: "Paris", distance: "Global mode",
    bio: "Composer · learning to be present. Late-night walks, long letters, intentional friendships.",
    interests: ["Music", "Walks", "Philosophy"], compatibility: 83, depth: 88,
    gradient: "linear-gradient(135deg, #8B5CF6, #3FB98E)" },
];

function Discover() {
  const { t } = useLang();
  const [intent, setIntent] = useState<(typeof intentions)[number]["key"]>("romance");
  const [index, setIndex] = useState(0);
  const [decisions, setDecisions] = useState<{ name: string; action: "like" | "pass" | "super" }[]>([]);

  const current = cards[index % cards.length];
  const next = cards[(index + 1) % cards.length];

  const decide = (action: "like" | "pass" | "super") => {
    setDecisions((d) => [{ name: current.name, action }, ...d].slice(0, 5));
    setIndex((i) => i + 1);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-sm text-muted-foreground">{t("discover.subtitle")}</div>
          <h1 className="font-display text-3xl sm:text-4xl font-medium mt-1">
            <span className="text-gradient-coral">{t("discover.title")}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{t("discover.mode.local")}</span>
        </div>
      </div>

      {/* Intention selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {intentions.map((i) => {
          const active = intent === i.key;
          return (
            <button
              key={i.key}
              onClick={() => setIntent(i.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border transition-all ${
                active
                  ? "border-transparent text-background shadow-soft"
                  : "border-border bg-card hover:border-foreground/30"
              }`}
              style={active ? { background: i.color } : undefined}
            >
              <i.icon className="h-4 w-4" /> {t(i.labelKey)}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Swipe stack */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="relative w-full max-w-md h-[560px]">
            {/* Next card preview */}
            <div className="absolute inset-x-4 top-4 bottom-0 rounded-[2rem] bg-card border border-border/60 shadow-soft scale-[0.97] opacity-70" />
            <AnimatePresence initial={false}>
              <SwipeCard key={index} person={current} onDecide={decide} />
            </AnimatePresence>

            {/* Action bar */}
            <div className="absolute -bottom-6 inset-x-0 flex justify-center gap-4 z-30">
              <ActionBtn onClick={() => decide("pass")} aria="Pass" tone="bg-card text-foreground border border-border">
                <X className="h-5 w-5" />
              </ActionBtn>
              <ActionBtn onClick={() => decide("super")} aria="Super bond" tone="bg-gradient-gold text-midnight">
                <Star className="h-5 w-5" />
              </ActionBtn>
              <ActionBtn onClick={() => decide("like")} aria="Bond" tone="bg-gradient-coral text-white shadow-glow">
                <Heart className="h-5 w-5" />
              </ActionBtn>
            </div>

            <div className="pointer-events-none absolute -inset-12 -z-10 bg-gradient-coral opacity-20 blur-3xl rounded-full" />
            {/* preload next image color */}
            <div className="sr-only">{next.name}</div>
          </div>
        </div>

        {/* Right rail */}
        <aside className="space-y-5">
          <div className="rounded-3xl border border-border/70 bg-card p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> {t("discover.why")}
            </div>
            <div className="mt-4 space-y-3">
              <Bar label={t("discover.compat")} value={current.compatibility} color="var(--color-romantic)" />
              <Bar label={t("discover.depth")} value={current.depth} color="var(--color-inner)" />
              <Bar label={t("discover.lifestyle")} value={77} color="var(--color-pro)" />
              <Bar label={t("discover.rhythm")} value={82} color="var(--color-friends)" />
            </div>
            <div className="mt-5 text-xs text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">3</span> {t("discover.mutual")}.
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t("discover.daily")}</div>
            <div className="flex items-end justify-between">
              <div className="font-display text-3xl">7<span className="text-base text-muted-foreground"> / 10</span></div>
              <div className="text-[11px] text-muted-foreground">Resets in 6h</div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-coral" style={{ width: "70%" }} />
            </div>
            <button className="mt-4 w-full rounded-full bg-gradient-hero text-ivory text-xs py-2.5 font-medium">
              {t("discover.upgrade")}
            </button>
          </div>

          {decisions.length > 0 && (
            <div className="rounded-3xl border border-border/70 bg-card p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t("discover.recent")}</div>
              <ul className="space-y-2 text-sm">
                {decisions.map((d, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>{d.name}</span>
                    <span className={`text-[10px] uppercase tracking-widest ${
                      d.action === "like" ? "text-coral" : d.action === "super" ? "text-gold" : "text-muted-foreground"
                    }`}>{d.action === "super" ? t("discover.action.super") : d.action === "like" ? t("discover.action.bond") : t("discover.action.pass")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function SwipeCard({ person, onDecide }: { person: Person; onDecide: (a: "like" | "pass" | "super") => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);
  const likeOp = useTransform(x, [40, 160], [0, 1]);
  const passOp = useTransform(x, [-160, -40], [1, 0]);

  const initial = useMemo(() => ({ scale: 0.96, opacity: 0, y: 20 }), []);

  return (
    <motion.div
      initial={initial}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ x: x.get() > 0 ? 600 : -600, opacity: 0, rotate: x.get() > 0 ? 20 : -20, transition: { duration: 0.45 } }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      style={{ x, rotate }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 140) onDecide("like");
        else if (info.offset.x < -140) onDecide("pass");
      }}
      className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-elegant cursor-grab active:cursor-grabbing z-20"
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
    >
      <div className="absolute inset-0" style={{ background: person.gradient }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Badges */}
      <motion.div style={{ opacity: likeOp }} className="absolute top-6 right-6 rounded-full bg-gradient-coral text-white text-xs font-medium px-3 py-1.5 rotate-12 shadow-glow">
        BOND
      </motion.div>
      <motion.div style={{ opacity: passOp }} className="absolute top-6 left-6 rounded-full bg-foreground/80 text-background text-xs font-medium px-3 py-1.5 -rotate-12">
        PASS
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <div className="flex items-center gap-2 text-xs opacity-80">
          <MapPin className="h-3 w-3" /> {person.city} · {person.distance}
        </div>
        <div className="font-display text-3xl font-medium mt-1">
          {person.name}, <span className="opacity-80">{person.age}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed opacity-90 line-clamp-3">{person.bio}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {person.interests.map((t) => (
            <span key={t} className="text-[10px] uppercase tracking-widest rounded-full bg-white/15 backdrop-blur px-2.5 py-1">{t}</span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Mini label="Compatibility" value={person.compatibility} />
          <Mini label="Depth" value={person.depth} />
        </div>
      </div>
    </motion.div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest opacity-70">{label}</div>
      <div className="font-display text-lg leading-none mt-1">{value}%</div>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-foreground/5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, aria, tone }: { children: React.ReactNode; onClick: () => void; aria: string; tone: string }) {
  return (
    <button
      aria-label={aria}
      onClick={onClick}
      className={`h-14 w-14 rounded-full flex items-center justify-center transition-transform active:scale-95 hover:scale-105 ${tone}`}
    >
      {children}
    </button>
  );
}