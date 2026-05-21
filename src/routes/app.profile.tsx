import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Mic, MapPin, Heart, Sparkles, Camera, Calendar } from "lucide-react";

export const Route = createFileRoute("/app/profile")({
  component: Profile,
});

const moments = [
  { title: "Lisbon · summer", tone: "var(--color-romantic)", when: "2022" },
  { title: "Sister's wedding", tone: "var(--color-family)", when: "2023" },
  { title: "Mountain trail", tone: "var(--color-friends)", when: "2024" },
  { title: "Studio opening", tone: "var(--color-pro)", when: "2024" },
  { title: "Birthday letter", tone: "var(--color-memory)", when: "2025" },
  { title: "Quiet morning", tone: "var(--color-inner)", when: "2025" },
];

function Profile() {
  return (
    <div>
      {/* Cover */}
      <div className="relative rounded-[2rem] overflow-hidden h-56 sm:h-72 bg-gradient-hero">
        <div className="absolute inset-0 opacity-30"
             style={{ backgroundImage: "radial-gradient(circle at 25% 30%, white 0.6px, transparent 1.2px), radial-gradient(circle at 75% 60%, white 0.6px, transparent 1.2px)", backgroundSize: "50px 50px, 80px 80px" }} />
        <div className="absolute -bottom-1 inset-x-0 h-24 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="-mt-16 px-2 sm:px-6 flex flex-col sm:flex-row sm:items-end gap-5">
        <div className="h-28 w-28 rounded-full ring-4 ring-background bg-gradient-coral flex items-center justify-center font-display text-4xl text-white shadow-elegant">
          A
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> Lisbon, PT · Global mode</div>
          <h1 className="font-display text-3xl sm:text-4xl font-medium mt-1">Alex Moreira, 29</h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
            Architect & quiet romantic. I believe in long letters, soft mornings, and friendships that age like wine.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-foreground text-background text-sm px-4 py-2.5 inline-flex items-center gap-1.5">
            <Camera className="h-4 w-4" /> Edit profile
          </button>
        </div>
      </div>

      {/* Voice intro */}
      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border/70 bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Voice intro</div>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button className="h-12 w-12 rounded-full bg-gradient-coral text-white flex items-center justify-center shadow-glow">
              <Mic className="h-5 w-5" />
            </button>
            <div className="flex-1 flex items-end gap-0.5 h-10">
              {Array.from({ length: 32 }).map((_, i) => (
                <span key={i} className="flex-1 rounded-sm" style={{
                  background: "var(--color-coral)",
                  height: `${20 + Math.abs(Math.sin(i)) * 70}%`,
                  opacity: 0.4 + (i % 5) * 0.1,
                }} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">0:24</span>
          </div>
        </motion.div>

        <div className="rounded-3xl border border-border/70 bg-card p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Relationship intent</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Romance", "Friendship", "Networking", "Community"].map((g, i) => (
              <span key={g} className={`text-xs rounded-full px-3 py-1.5 border ${i < 2 ? "bg-foreground text-background border-transparent" : "text-muted-foreground"}`}>
                {g}
              </span>
            ))}
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mt-5">Interests</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Architecture", "Vinyl", "Slow food", "Cinema", "Mountains", "Letters", "Espresso"].map((t) => (
              <span key={t} className="text-xs rounded-full px-3 py-1.5 bg-muted">{t}</span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-gold text-midnight p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
            <Sparkles className="h-3.5 w-3.5" /> Emotional health
          </div>
          <div className="mt-3 font-display text-5xl">84</div>
          <div className="text-xs mt-2 opacity-80">Your relational rhythm is calm and intentional. Reach out to 1 dormant bond this week.</div>
        </div>
      </div>

      {/* Memory highlights */}
      <div className="mt-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl font-medium">Memory highlights</h2>
            <p className="text-sm text-muted-foreground">A cinematic timeline of moments worth keeping.</p>
          </div>
          <button className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> View timeline
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {moments.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-soft"
              style={{ background: `linear-gradient(135deg, ${m.tone}, color-mix(in oklab, ${m.tone} 40%, black))` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-[10px] uppercase tracking-widest opacity-80">{m.when}</div>
                <div className="font-display text-sm leading-tight mt-0.5">{m.title}</div>
              </div>
              <Heart className="absolute top-3 right-3 h-3.5 w-3.5 text-white/80" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}