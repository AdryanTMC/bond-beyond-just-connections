import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Send, Heart, Loader2 } from "lucide-react";
import { useLang } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/messages")({
  component: Messages,
});

type MatchRow = {
  id: string;
  user_a: string;
  user_b: string;
  created_at: string;
};
type Other = { id: string; display_name: string | null; photos: string[] | null };
type Thread = MatchRow & { other: Other };
type Msg = { id: string; sender_id: string; body: string; created_at: string };

function Messages() {
  const { t } = useLang();
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadThreads = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data: matches } = await supabase
      .from("matches")
      .select("id,user_a,user_b,created_at")
      .order("created_at", { ascending: false });
    if (!matches || matches.length === 0) {
      setThreads([]);
      setLoading(false);
      return;
    }
    const otherIds = matches.map((m) => (m.user_a === user.id ? m.user_b : m.user_a));
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,display_name,photos")
      .in("id", otherIds);
    const map = new Map<string, Other>();
    (profiles ?? []).forEach((p) => map.set(p.id, p as Other));
    const built: Thread[] = matches.map((m) => {
      const otherId = m.user_a === user.id ? m.user_b : m.user_a;
      return { ...m, other: map.get(otherId) ?? { id: otherId, display_name: null, photos: null } };
    });
    setThreads(built);
    if (!active && built.length > 0) setActive(built[0].id);
    setLoading(false);
  }, [user, active]);

  const loadMessages = useCallback(async (matchId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("id,sender_id,body,created_at")
      .eq("match_id", matchId)
      .order("created_at", { ascending: true });
    setMessages((data as Msg[]) ?? []);
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (!active) return;
    loadMessages(active);
    const channel = supabase
      .channel(`messages:${active}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${active}` },
        (payload) => {
          setMessages((m) => [...m, payload.new as Msg]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [active, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!draft.trim() || !active || !user || sending) return;
    const body = draft.trim();
    setDraft("");
    setSending(true);
    const { error } = await supabase.from("messages").insert({ match_id: active, sender_id: user.id, body });
    setSending(false);
    if (error) {
      console.error(error);
      setDraft(body);
    }
  };

  const thread = threads.find((th) => th.id === active);

  return (
    <div>
      <div className="mb-6">
        <div className="text-sm text-muted-foreground">{t("msg.title")}</div>
        <h1 className="font-display text-3xl sm:text-4xl font-medium mt-1">
          {t("msg.h1a")} <span className="text-gradient-coral">{t("msg.h1b")}</span>.
        </h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-5 rounded-3xl border border-border/70 bg-card overflow-hidden h-[640px]">
        <aside className="lg:col-span-4 border-r border-border/60 overflow-y-auto">
          <div className="p-4 border-b border-border/60 text-xs uppercase tracking-widest text-muted-foreground">
            Your matches
          </div>
          {loading ? (
            <div className="p-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : threads.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground text-center">
              No matches yet. Keep swiping in Discover.
            </div>
          ) : (
            threads.map((th) => (
              <button
                key={th.id}
                onClick={() => setActive(th.id)}
                className={`w-full text-left flex items-center gap-3 p-4 border-b border-border/60 hover:bg-foreground/[0.03] transition-colors ${
                  active === th.id ? "bg-foreground/[0.04]" : ""
                }`}
              >
                <div className="h-11 w-11 shrink-0 rounded-full bg-gradient-coral overflow-hidden flex items-center justify-center text-white text-sm font-medium">
                  {th.other.photos?.[0] ? (
                    <img src={th.other.photos[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    (th.other.display_name ?? "?").charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{th.other.display_name ?? "Someone"}</div>
                  <div className="text-[11px] text-muted-foreground">Matched · {new Date(th.created_at).toLocaleDateString()}</div>
                </div>
              </button>
            ))
          )}
        </aside>

        <section className="lg:col-span-8 flex flex-col min-w-0">
          {thread ? (
            <>
              <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-coral overflow-hidden flex items-center justify-center text-white text-sm font-medium">
                  {thread.other.photos?.[0] ? (
                    <img src={thread.other.photos[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    (thread.other.display_name ?? "?").charAt(0)
                  )}
                </div>
                <div>
                  <div className="font-medium">{thread.other.display_name ?? "Someone"}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Heart className="h-3 w-3 text-coral" /> Matched
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gradient-soft">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-10">Say hi 👋</p>
                ) : (
                  messages.map((m) => {
                    const mine = m.sender_id === user?.id;
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          mine ? "bg-foreground text-background" : "bg-card border border-border/70"
                        }`}>
                          {m.body}
                          <div className="text-[10px] opacity-60 mt-1">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-border/60 p-3 flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={t("msg.placeholder")}
                  maxLength={1000}
                  className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none"
                />
                <button
                  onClick={send}
                  disabled={sending || !draft.trim()}
                  className="h-10 w-10 rounded-full bg-gradient-coral text-white flex items-center justify-center shadow-glow disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Select a match to start chatting
            </div>
          )}
        </section>
      </div>
    </div>
  );
}