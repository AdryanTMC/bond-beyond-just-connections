import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Camera, Plus, Loader2, X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/i18n";
import avatar from "@/assets/person-sofia.jpg";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/profile")({
  component: Profile,
});

function Profile() {
  const { t } = useLang();
  const { profile } = useProfile();
  const { user } = useAuth();

  const fullName = profile?.display_name?.trim() || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "—";
  const age = profile?.birthdate
    ? Math.floor((Date.now() - new Date(profile.birthdate).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;
  const location = [profile?.city, profile?.country].filter(Boolean).join(", ") || t("profile.location");
  const avatarUrl = profile?.photos?.[0] || (user?.user_metadata?.avatar_url as string | undefined) || avatar;
  const userInterests = profile?.interests && profile.interests.length > 0 ? profile.interests : null;
  const extraPhotos = (profile?.photos ?? []).slice(1);

  return (
    <div>
      {/* Cover */}
      <Cover />

      <div className="mt-6 px-2 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <img src={avatarUrl} alt="Profile" className="h-28 w-28 rounded-full object-cover ring-4 ring-background shadow-elegant" />
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {location}</div>
          <h1 className="font-display text-3xl sm:text-4xl font-medium mt-1">{fullName}{age ? `, ${age}` : ""}</h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">{profile?.bio || t("profile.bio")}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/onboarding"
            className="rounded-full bg-foreground text-background text-sm px-4 py-2.5 inline-flex items-center gap-1.5 hover:opacity-90 transition"
          >
            <Camera className="h-4 w-4" /> {t("profile.edit")}
          </Link>
        </div>
      </div>

      {/* Highlights (Instagram-style) */}
      <Highlights />

      {/* Info cards */}
      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-border/70 bg-card p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{t("profile.intent")}</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-xs rounded-full px-3 py-1.5 bg-foreground text-background capitalize">
              {profile?.seeking || t("discover.intent.romance")}
            </span>
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mt-5">{t("profile.interests")}</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {userInterests
              ? userInterests.map((tag) => (
                  <span key={tag} className="text-xs rounded-full px-3 py-1.5 bg-muted">{tag}</span>
                ))
              : <span className="text-xs text-muted-foreground">—</span>}
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Preferências</div>
          <div className="mt-3 text-sm">
            <span className="text-muted-foreground">Idade: </span>
            <span className="font-medium">{profile?.min_age ?? 18}–{profile?.max_age ?? 60}</span>
          </div>
          <div className="mt-2 text-sm flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{location}</span>
          </div>
        </div>
      </div>

      {/* Memory highlights */}
      {extraPhotos.length > 0 && (
      <div className="mt-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl font-medium">{t("profile.memories.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("profile.memories.sub")}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {extraPhotos.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-soft"
            >
              <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}

function Highlights() {
  const { profile, refresh } = useProfile();
  const { user } = useAuth();
  const highlights = profile?.highlights ?? [];
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewer, setViewer] = useState<number | null>(null);
  const MAX = 10;

  const persist = async (next: string[]) => {
    if (!user) return;
    const { error: e } = await supabase.from("profiles").update({ highlights: next }).eq("id", user.id);
    if (e) {
      setError(e.message);
      return;
    }
    await refresh();
  };

  const onPick = async (file: File) => {
    if (!user) return;
    if (highlights.length >= MAX) {
      setError(`Máximo de ${MAX} destaques`);
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/highlights/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("profile-photos").upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("profile-photos").getPublicUrl(path);
      await persist([...highlights, data.publicUrl]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload falhou");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = async (i: number) => {
    const next = highlights.filter((_, idx) => idx !== i);
    await persist(next);
    setViewer((v) => {
      if (v === null) return v;
      if (next.length === 0) return null;
      return Math.min(v, next.length - 1);
    });
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-medium">Destaques</h2>
        <span className="text-xs text-muted-foreground">{highlights.length}/{MAX}</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {/* Add button */}
        {highlights.length < MAX && (
          <label className="shrink-0 flex flex-col items-center gap-2 cursor-pointer group">
            <span className="h-[72px] w-[72px] rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground group-hover:border-foreground/40 group-hover:text-foreground transition-colors">
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
            </span>
            <span className="text-[11px] text-muted-foreground">Novo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPick(f);
                e.target.value = "";
              }}
            />
          </label>
        )}

        {highlights.map((src, i) => (
          <button
            key={src}
            onClick={() => setViewer(i)}
            className="shrink-0 flex flex-col items-center gap-2 group"
          >
            <span className="h-[72px] w-[72px] rounded-full p-[3px] bg-gradient-coral">
              <span className="block h-full w-full rounded-full p-[2px] bg-background">
                <img src={src} alt={`Destaque ${i + 1}`} loading="lazy" className="h-full w-full rounded-full object-cover" />
              </span>
            </span>
            <span className="text-[11px] text-muted-foreground">#{i + 1}</span>
          </button>
        ))}

        {highlights.length === 0 && (
          <p className="self-center text-sm text-muted-foreground">Adicione fotos em destaque, como no Instagram.</p>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <AnimatePresence>
        {viewer !== null && highlights[viewer] && (
          <HighlightViewer
            photos={highlights}
            index={viewer}
            onIndex={setViewer}
            onClose={() => setViewer(null)}
            onRemove={removeAt}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function HighlightViewer({
  photos, index, onIndex, onClose, onRemove,
}: {
  photos: string[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  onRemove: (i: number) => void;
}) {
  const prev = () => onIndex(index > 0 ? index - 1 : photos.length - 1);
  const next = () => onIndex(index < photos.length - 1 ? index + 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-midnight/90 backdrop-blur flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Progress bars */}
      <div className="absolute top-4 inset-x-0 px-4 flex gap-1.5 max-w-md mx-auto">
        {photos.map((_, i) => (
          <span key={i} className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden">
            <span className={`block h-full rounded-full bg-white ${i <= index ? "w-full" : "w-0"}`} />
          </span>
        ))}
      </div>

      <button onClick={onClose} className="absolute top-10 right-4 h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center">
        <X className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(index); }}
        className="absolute top-10 left-4 h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center"
        aria-label="Remover destaque"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-2 sm:left-6 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-2 sm:right-6 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center"
        aria-label="Próximo"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <motion.img
        key={photos[index]}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        src={photos[index]}
        alt={`Destaque ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] max-w-md w-full object-contain rounded-2xl"
      />
    </motion.div>
  );
}