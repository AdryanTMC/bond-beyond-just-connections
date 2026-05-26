import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Heart, X, Star, MapPin, Sparkles, SlidersHorizontal, MessageCircle, Loader2 } from "lucide-react";
import { useLang } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfile, type Profile } from "@/hooks/use-profile";

export const Route = createFileRoute("/app/discover")({
  component: Discover,
});

type Candidate = Pick<Profile, "id" | "display_name" | "bio" | "birthdate" | "city" | "interests" | "photos"> & { score?: number };

function ageFromBirthdate(b: string | null): number | null {
  if (!b) return null;
  const d = new Date(b);
  if (isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
}

function affinityScore(
  me: { interests?: string[] | null; city?: string | null; min_age?: number | null; max_age?: number | null },
  other: { interests?: string[] | null; city?: string | null; birthdate?: string | null }
): number {
  let score = 0;
  const mine = new Set((me.interests ?? []).map((x) => x.toLowerCase()));
  const theirs = (other.interests ?? []).map((x) => x.toLowerCase());
  const shared = theirs.filter((i) => mine.has(i)).length;
  // Up to 60 pts from interests (12 per shared, capped)
  score += Math.min(shared * 12, 60);
  // Same city: 25 pts
  if (me.city && other.city && me.city.trim().toLowerCase() === other.city.trim().toLowerCase()) score += 25;
  // Age within preferred range: 15 pts; otherwise scaled penalty
  const a = ageFromBirthdate(other.birthdate ?? null);
  if (a !== null) {
    const min = me.min_age ?? 18;
    const max = me.max_age ?? 80;
    if (a >= min && a <= max) score += 15;
  }
  return score;
}

function Discover() {
  const { t } = useLang();
  const { user } = useAuth();
  const { profile } = useProfile();
  const userId = user?.id;
  const minAge = profile?.min_age ?? 18;
  const maxAge = profile?.max_age ?? 80;
  const seeking = profile?.seeking ?? null;
  const myCity = profile?.city ?? null;
  const myInterestsKey = (profile?.interests ?? []).join("|");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchPerson, setMatchPerson] = useState<Candidate | null>(null);
  const [recent, setRecent] = useState<{ name: string; action: "like" | "pass" | "super" }[]>([]);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    // Get IDs already swiped to exclude
    const { data: swiped } = await supabase.from("swipes").select("target_id").eq("swiper_id", userId);
    const excluded = new Set<string>((swiped ?? []).map((s) => s.target_id));
    excluded.add(userId);

    let query = supabase
      .from("profiles")
      .select("id,display_name,bio,birthdate,city,interests,photos,seeking,gender")
      .eq("is_active", true)
      .eq("onboarding_completed", true)
      .limit(50);

    // Reciprocal gender filter
    if (seeking && seeking !== "everyone") {
      const wanted = seeking === "women" ? "woman" : seeking === "men" ? "man" : null;
      if (wanted) query = query.eq("gender", wanted);
    }

    const { data, error } = await query;
    if (error) {
      setCandidates([]);
      setLoading(false);
      return;
    }
    const filtered = (data ?? []).filter((p) => {
      if (excluded.has(p.id)) return false;
      const a = ageFromBirthdate(p.birthdate);
      if (a !== null && (a < minAge || a > maxAge)) return false;
      return true;
    });
    const me = { interests: profile?.interests ?? null, city: myCity, min_age: minAge, max_age: maxAge };
    const scored = filtered
      .map((p) => ({ ...p, score: affinityScore(me, p) }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    setCandidates(scored);
    setIndex(0);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, minAge, maxAge, seeking, myCity, myInterestsKey]);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime: detect new matches involving the current user
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`matches:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "matches" },
        async (payload) => {
          const m = payload.new as { user_a: string; user_b: string };
          if (m.user_a !== userId && m.user_b !== userId) return;
          const otherId = m.user_a === userId ? m.user_b : m.user_a;
          const { data } = await supabase
            .from("profiles")
            .select("id,display_name,bio,birthdate,city,interests,photos")
            .eq("id", otherId)
            .maybeSingle();
          if (data) setMatchPerson((curr) => (curr && curr.id === otherId ? curr : (data as Candidate)));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const current = candidates[index] ?? null;

  const decide = async (action: "like" | "pass" | "super") => {
    if (!current || !userId) return;
    const liked = action !== "pass";
    setRecent((r) => [{ name: current.display_name ?? "", action }, ...r].slice(0, 5));
    setIndex((i) => i + 1);

    const { error } = await supabase.from("swipes").insert({
      swiper_id: userId,
      target_id: current.id,
      liked,
    });
    if (error) {
      return;
    }
    if (liked) {
      // Check if a match was created by the trigger
      const a = userId < current.id ? userId : current.id;
      const b = userId < current.id ? current.id : userId;
      const { data: match } = await supabase
        .from("matches")
        .select("id")
        .eq("user_a", a)
        .eq("user_b", b)
        .maybeSingle();
      if (match) setMatchPerson(current);
    }
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
        <Link
          to="/app/settings"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {t("discover.filters")} · {profile?.min_age ?? 18}-{profile?.max_age ?? 80}
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex justify-center">
          <div className="relative w-full max-w-md h-[560px]">
            {loading ? (
              <div className="absolute inset-0 rounded-[2rem] border border-border bg-card/40 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : current ? (
              <>
                <AnimatePresence initial={false}>
                  <SwipeCard key={`${current.id}-${index}`} person={current} onDecide={decide} />
                </AnimatePresence>
                <div className="absolute -bottom-6 inset-x-0 flex justify-center gap-4 z-30">
                  <ActionBtn onClick={() => decide("pass")} aria="Pass" tone="bg-card text-foreground border border-border">
                    <X className="h-5 w-5" />
                  </ActionBtn>
                  <ActionBtn onClick={() => decide("super")} aria="Super bond" tone="bg-card text-gold border border-border">
                    <Star className="h-5 w-5" />
                  </ActionBtn>
                  <ActionBtn onClick={() => decide("like")} aria="Bond" tone="bg-coral text-white">
                    <Heart className="h-5 w-5" />
                  </ActionBtn>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 rounded-[2rem] border border-dashed border-border/70 bg-card/50 flex flex-col items-center justify-center text-center p-8">
                <Sparkles className="h-8 w-8 text-muted-foreground mb-4" />
                <div className="font-display text-xl">{t("discover.empty.title")}</div>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  No one new right now. Adjust your preferences or come back later.
                </p>
                <Link
                  to="/app/settings"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Open settings
                </Link>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-border/70 bg-card p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> {t("discover.why")}
            </div>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Matches scored by shared interests, age range and intent. Be authentic — depth beats volume.
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-foreground font-medium">{candidates.length - index}</span> people in your queue
            </div>
          </div>

          {recent.length > 0 && (
            <div className="rounded-3xl border border-border/70 bg-card p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t("discover.recent")}</div>
              <ul className="space-y-2 text-sm">
                {recent.map((d, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>{d.name}</span>
                    <span className={`text-[10px] uppercase tracking-widest ${
                      d.action === "like" ? "text-coral" : d.action === "super" ? "text-gold" : "text-muted-foreground"
                    }`}>{d.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <AnimatePresence>
        {matchPerson && <MatchModal person={matchPerson} onClose={() => setMatchPerson(null)} />}
      </AnimatePresence>
    </div>
  );
}

function SwipeCard({ person, onDecide }: { person: Candidate; onDecide: (a: "like" | "pass" | "super") => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);
  const likeOp = useTransform(x, [40, 160], [0, 1]);
  const passOp = useTransform(x, [-160, -40], [1, 0]);
  const age = ageFromBirthdate(person.birthdate);
  const photo = person.photos?.[0];
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
      className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-soft cursor-grab active:cursor-grabbing z-20 bg-muted"
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
    >
      {photo ? (
        <img src={photo} alt={person.display_name ?? ""} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/70 text-6xl font-display">
          {(person.display_name ?? "?").charAt(0)}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      <motion.div style={{ opacity: likeOp }} className="absolute top-6 right-6 rounded-full bg-gradient-coral text-white text-xs font-medium px-3 py-1.5 rotate-12 shadow-glow">
        BOND
      </motion.div>
      <motion.div style={{ opacity: passOp }} className="absolute top-6 left-6 rounded-full bg-foreground/80 text-background text-xs font-medium px-3 py-1.5 -rotate-12">
        PASS
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        {person.city && (
          <div className="flex items-center gap-2 text-xs opacity-80">
            <MapPin className="h-3 w-3" /> {person.city}
          </div>
        )}
        <div className="font-display text-3xl font-medium mt-1">
          {person.display_name}{age ? <>, <span className="opacity-80">{age}</span></> : null}
        </div>
        {typeof person.score === "number" && person.score > 0 && (
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur text-[11px] px-2.5 py-1">
            <Sparkles className="h-3 w-3" /> {person.score}% affinity
          </div>
        )}
        {person.bio && <p className="mt-2 text-sm leading-relaxed opacity-90 line-clamp-3">{person.bio}</p>}
        {person.interests && person.interests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {person.interests.slice(0, 5).map((i) => (
              <span key={i} className="rounded-full bg-white/15 backdrop-blur text-[11px] px-2.5 py-1">{i}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ActionBtn({
  onClick, aria, tone, children,
}: { onClick: () => void; aria: string; tone: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={aria}
      className={`h-14 w-14 rounded-full flex items-center justify-center transition-transform active:scale-90 ${tone}`}
    >
      {children}
    </button>
  );
}

function MatchModal({ person, onClose }: { person: Candidate; onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-midnight/80 backdrop-blur flex items-center justify-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-card p-8 text-center shadow-elegant"
      >
        <div className="mx-auto h-16 w-16 rounded-full bg-gradient-coral flex items-center justify-center shadow-glow">
          <Heart className="h-7 w-7 text-white" />
        </div>
        <h2 className="font-display text-3xl mt-5">It's a bond!</h2>
        <p className="text-sm text-muted-foreground mt-2">You and {person.display_name} liked each other.</p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => navigate({ to: "/app/messages" })}
            className="w-full rounded-full bg-gradient-coral text-white py-3 text-sm font-medium shadow-glow inline-flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" /> Send a message
          </button>
          <button onClick={onClose} className="w-full text-sm text-muted-foreground py-2">Keep swiping</button>
        </div>
      </motion.div>
    </motion.div>
  );
}