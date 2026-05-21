import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Send, Mic, Image as ImageIcon, Sparkles, Heart, Lock } from "lucide-react";

export const Route = createFileRoute("/app/messages")({
  component: Messages,
});

type Msg = { from: "me" | "them"; text: string; at: string; reaction?: string; memory?: { title: string; tone: string } };

const threads = [
  { id: "mariana", name: "Mariana", color: "var(--color-romantic)", last: "I still remember Lisbon…", unread: 2, online: true },
  { id: "lucas", name: "Lucas", color: "var(--color-inner)", last: "Coffee Sunday?", unread: 0, online: true },
  { id: "mom", name: "Mom", color: "var(--color-family)", last: "Voice note", unread: 1, online: false },
  { id: "sarah", name: "Sarah", color: "var(--color-friends)", last: "It's been a while ❤️", unread: 0, online: false },
  { id: "theo", name: "Théo", color: "var(--color-pro)", last: "Let's collaborate", unread: 0, online: true },
];

const initialMessages: Record<string, Msg[]> = {
  mariana: [
    { from: "them", text: "I was listening to that vinyl you sent. It still makes me cry.", at: "20:11" },
    { from: "me", text: "It's been three years already. Lisbon feels like yesterday.", at: "20:12", reaction: "❤️" },
    { from: "them", text: "Can we add it to our album?", at: "20:14",
      memory: { title: "Lisbon · Summer", tone: "var(--color-romantic)" } },
    { from: "me", text: "Sealing it as a capsule for our 5-year anniversary.", at: "20:15" },
  ],
  lucas: [{ from: "them", text: "Coffee Sunday?", at: "11:02" }],
  mom: [{ from: "them", text: "🎙️ Voice note · 0:32", at: "09:45" }],
  sarah: [{ from: "them", text: "It's been a while ❤️", at: "Yesterday" }],
  theo: [{ from: "them", text: "Let's collaborate", at: "Mon" }],
};

function Messages() {
  const [active, setActive] = useState("mariana");
  const [draft, setDraft] = useState("");
  const [convo, setConvo] = useState<Record<string, Msg[]>>(initialMessages);
  const thread = threads.find((t) => t.id === active)!;
  const list = convo[active] ?? [];

  const send = () => {
    if (!draft.trim()) return;
    setConvo((c) => ({ ...c, [active]: [...(c[active] ?? []), { from: "me", text: draft, at: "now" }] }));
    setDraft("");
  };

  return (
    <div>
      <div className="mb-6">
        <div className="text-sm text-muted-foreground">Messages</div>
        <h1 className="font-display text-3xl sm:text-4xl font-medium mt-1">
          Conversations that <span className="text-gradient-coral">remember themselves</span>.
        </h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-5 rounded-3xl border border-border/70 bg-card overflow-hidden h-[640px]">
        {/* Threads */}
        <aside className="lg:col-span-4 border-r border-border/60 overflow-y-auto">
          <div className="p-4 border-b border-border/60 text-xs uppercase tracking-widest text-muted-foreground">
            Inner circle
          </div>
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`w-full text-left flex items-center gap-3 p-4 border-b border-border/60 hover:bg-foreground/[0.03] transition-colors ${
                active === t.id ? "bg-foreground/[0.04]" : ""
              }`}
            >
              <div className="relative h-11 w-11 rounded-full flex items-center justify-center font-display"
                   style={{ background: `color-mix(in oklab, ${t.color} 22%, transparent)`, color: t.color }}>
                {t.name[0]}
                {t.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-pro border-2 border-card" style={{ background: "var(--color-pro)" }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{t.name}</div>
                  {t.unread > 0 && <span className="text-[10px] bg-gradient-coral text-white rounded-full px-1.5 py-0.5">{t.unread}</span>}
                </div>
                <div className="text-xs text-muted-foreground truncate">{t.last}</div>
              </div>
            </button>
          ))}
        </aside>

        {/* Conversation */}
        <section className="lg:col-span-8 flex flex-col min-w-0">
          <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center font-display"
                   style={{ background: `color-mix(in oklab, ${thread.color} 22%, transparent)`, color: thread.color }}>
                {thread.name[0]}
              </div>
              <div>
                <div className="font-medium">{thread.name}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Heart className="h-3 w-3" style={{ color: thread.color }} /> Bond strength · 96%
                </div>
              </div>
            </div>
            <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Couple space
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-soft">
            {list.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === "me" ? "bg-foreground text-background" : "bg-card border border-border/70"
                }`}>
                  {m.text}
                  {m.memory && (
                    <div className="mt-2.5 rounded-xl p-3 border" style={{ borderColor: m.memory.tone, background: `color-mix(in oklab, ${m.memory.tone} 12%, transparent)` }}>
                      <div className="text-[10px] uppercase tracking-widest opacity-70">Shared memory</div>
                      <div className="font-display text-sm mt-0.5">{m.memory.title}</div>
                    </div>
                  )}
                  <div className="text-[10px] opacity-60 mt-1.5 flex items-center gap-2">
                    {m.at} {m.reaction && <span>· {m.reaction}</span>}
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="rounded-2xl bg-gradient-hero text-ivory p-4 mx-auto max-w-md">
              <div className="text-[10px] uppercase tracking-widest opacity-80 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> AI suggestion
              </div>
              <div className="text-sm mt-1.5">“Send the photo from your Lisbon trip — it would land warmly right now.”</div>
              <div className="mt-3 flex gap-2">
                <button className="rounded-full bg-ivory text-midnight text-[11px] px-3 py-1.5 font-medium">Use it</button>
                <button className="rounded-full bg-white/10 border border-white/15 text-[11px] px-3 py-1.5 font-medium">Skip</button>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 p-3 flex items-center gap-2">
            <button className="h-10 w-10 rounded-full bg-muted flex items-center justify-center" aria-label="Add memory">
              <ImageIcon className="h-4 w-4" />
            </button>
            <button className="h-10 w-10 rounded-full bg-muted flex items-center justify-center" aria-label="Voice note">
              <Mic className="h-4 w-4" />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Write something they'll remember…"
              className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none"
            />
            <button onClick={send} className="h-10 w-10 rounded-full bg-gradient-coral text-white flex items-center justify-center shadow-glow">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}