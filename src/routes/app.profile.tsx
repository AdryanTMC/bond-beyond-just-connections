import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { MapPin, Camera } from "lucide-react";
import { useLang } from "@/i18n";
import avatar from "@/assets/person-sofia.jpg";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";

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
      <div className="relative rounded-[2rem] overflow-hidden h-40 sm:h-52 bg-muted" />

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