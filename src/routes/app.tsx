import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Heart, Home, Users, Sparkles, Clock, MapPin, Lock, Bell, Search, Plus,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Bond — Your relationships" },
      { name: "description", content: "Your inner circles, timeline, and memory capsules — all in one calm place." },
    ],
  }),
  component: AppShell,
});

const circles = [
  { name: "Family", color: "var(--color-family)", count: 6 },
  { name: "Inner Circle", color: "var(--color-inner)", count: 4 },
  { name: "Friends", color: "var(--color-friends)", count: 18 },
  { name: "Love", color: "var(--color-romantic)", count: 1 },
  { name: "Work", color: "var(--color-pro)", count: 23 },
];

const people = [
  { name: "Mariana", note: "Last memory · 12 days ago", color: "var(--color-romantic)", strength: 96 },
  { name: "Mom", note: "Birthday in 2 weeks", color: "var(--color-family)", strength: 88 },
  { name: "Sarah", note: "You haven't talked in 42 days", color: "var(--color-friends)", strength: 54 },
  { name: "Lucas", note: "Shared a new memory", color: "var(--color-inner)", strength: 91 },
  { name: "Carla", note: "3-year friendship anniversary today", color: "var(--color-memory)", strength: 72 },
  { name: "Daniel", note: "Capsule unlocks in 9 days", color: "var(--color-pro)", strength: 60 },
];

const timeline = [
  { when: "Today", title: "Anniversary unlocked", body: "3 years since your trip to Lisbon with Mariana.", color: "var(--color-romantic)" },
  { when: "Yesterday", title: "Mom shared a memory", body: "A photo from your graduation.", color: "var(--color-family)" },
  { when: "2 days ago", title: "Capsule sealed", body: "A voice note for Lucas, unlocks in 1 year.", color: "var(--color-memory)" },
  { when: "Last week", title: "New bond", body: "You added Daniel to your Work circle.", color: "var(--color-pro)" },
];

function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border/60 min-h-screen p-5 sticky top-0">
          <Link to="/" className="flex items-center gap-2 mb-9">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-coral shadow-glow">
              <Heart className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl font-semibold">Bond</span>
          </Link>

          <nav className="space-y-1 text-sm">
            <NavItem icon={Home} label="Home" active />
            <NavItem icon={Users} label="Circles" />
            <NavItem icon={Clock} label="Timeline" />
            <NavItem icon={MapPin} label="Relationship Map" />
            <NavItem icon={Lock} label="Memory Capsules" />
            <NavItem icon={Sparkles} label="AI Assistant" />
          </nav>

          <div className="mt-8">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground px-3 mb-3">Your circles</div>
            <div className="space-y-1.5">
              {circles.map((c) => (
                <div key={c.name} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-foreground/5 cursor-pointer">
                  <span className="flex items-center gap-2.5 text-sm">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                    {c.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{c.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-2xl bg-gradient-hero p-4 text-ivory">
            <div className="text-xs opacity-80">Premium</div>
            <div className="font-display text-base mt-1">Unlock AI & capsules</div>
            <button className="mt-3 w-full rounded-full bg-ivory text-midnight text-xs py-2 font-medium">Upgrade</button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Topbar */}
          <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
            <div className="px-6 lg:px-10 py-4 flex items-center gap-4">
              <div className="flex-1 max-w-md flex items-center gap-2 rounded-full bg-muted px-4 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search people, memories, moments…"
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
                />
              </div>
              <button className="relative h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-coral" />
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2.5 text-sm font-medium">
                <Plus className="h-4 w-4" /> New bond
              </button>
            </div>
          </div>

          <div className="px-6 lg:px-10 py-10 max-w-7xl">
            {/* Greeting */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="text-sm text-muted-foreground">Good evening</div>
              <h1 className="font-display text-4xl sm:text-5xl font-medium mt-1.5">
                Some bonds are <span className="text-gradient-coral">whispering to you</span>.
              </h1>
            </motion.div>

            {/* Stats */}
            <div className="mt-9 grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Active bonds" value="52" hint="+3 this month" />
              <StatCard label="Memories preserved" value="284" hint="12 this week" />
              <StatCard label="Capsules sealed" value="7" hint="2 unlock soon" />
              <StatCard label="Avg. emotional health" value="84" hint="+6 vs last month" highlight />
            </div>

            {/* Two column */}
            <div className="mt-10 grid lg:grid-cols-3 gap-6">
              {/* People */}
              <section className="lg:col-span-2">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <h2 className="font-display text-2xl font-medium">People who matter</h2>
                    <p className="text-sm text-muted-foreground mt-1">Sorted by emotional rhythm.</p>
                  </div>
                  <button className="text-sm text-muted-foreground hover:text-foreground">View map →</button>
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
                        <div
                          className="h-12 w-12 rounded-full flex items-center justify-center font-display text-lg"
                          style={{ background: `color-mix(in oklab, ${p.color} 22%, transparent)`, color: p.color }}
                        >
                          {p.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{p.note}</div>
                        </div>
                      </div>
                      <div className="relative mt-5">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                          <span>Bond strength</span>
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

              {/* Right rail */}
              <aside className="space-y-6">
                {/* AI */}
                <div className="rounded-3xl p-6 bg-gradient-hero text-ivory shadow-elegant">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
                    <Sparkles className="h-3.5 w-3.5" /> AI Assistant
                  </div>
                  <p className="mt-4 font-display text-lg leading-snug">
                    “Sarah's been quiet for a while. Want me to draft a soft hello with a memory from last summer?”
                  </p>
                  <div className="mt-5 flex gap-2">
                    <button className="rounded-full bg-ivory text-midnight text-xs px-3.5 py-2 font-medium">Draft message</button>
                    <button className="rounded-full bg-white/10 border border-white/15 text-xs px-3.5 py-2 font-medium">Later</button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="rounded-3xl border border-border/70 bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-medium">Recent timeline</h3>
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

            <div className="mt-10 text-center text-xs text-muted-foreground">
              Bond · Laço — Relationships that stay.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active }: { icon: typeof Heart; label: string; active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
      active ? "bg-foreground text-background" : "hover:bg-foreground/5 text-foreground/80"
    }`}>
      <Icon className="h-4 w-4" strokeWidth={1.75} />
      {label}
    </button>
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
