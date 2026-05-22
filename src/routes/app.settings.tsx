import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Globe2, Heart, Save } from "lucide-react";
import { useLang } from "@/i18n";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Bond — Settings" }] }),
});

const ALL_COUNTRIES = [
  { c: "BR", flag: "🇧🇷", name: "Brazil" },
  { c: "PT", flag: "🇵🇹", name: "Portugal" },
  { c: "US", flag: "🇺🇸", name: "United States" },
  { c: "ES", flag: "🇪🇸", name: "Spain" },
  { c: "FR", flag: "🇫🇷", name: "France" },
  { c: "IT", flag: "🇮🇹", name: "Italy" },
  { c: "DE", flag: "🇩🇪", name: "Germany" },
  { c: "GB", flag: "🇬🇧", name: "UK" },
  { c: "JP", flag: "🇯🇵", name: "Japan" },
  { c: "KR", flag: "🇰🇷", name: "Korea" },
  { c: "MX", flag: "🇲🇽", name: "Mexico" },
  { c: "AR", flag: "🇦🇷", name: "Argentina" },
];

const LIKES = [
  "Art", "Music", "Cinema", "Travel", "Yoga", "Coffee", "Wine",
  "Hiking", "Gaming", "Fashion", "Cooking", "Photography",
  "Reading", "Dancing", "Fitness", "Spirituality", "Tech", "Nature",
];

type Tab = "distance" | "countries" | "match";

function SettingsPage() {
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>("distance");
  const [distance, setDistance] = useState(50);
  const [global, setGlobal] = useState(false);
  const [countries, setCountries] = useState<string[]>(["BR", "PT"]);
  const [gender, setGender] = useState<string>("everyone");
  const [ageMin, setAgeMin] = useState(22);
  const [ageMax, setAgeMax] = useState(38);
  const [likes, setLikes] = useState<string[]>(["Art", "Music", "Travel"]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("bond.settings");
      if (!raw) return;
      const s = JSON.parse(raw);
      if (typeof s.distance === "number") setDistance(s.distance);
      if (typeof s.global === "boolean") setGlobal(s.global);
      if (Array.isArray(s.countries)) setCountries(s.countries);
      if (typeof s.gender === "string") setGender(s.gender);
      if (typeof s.ageMin === "number") setAgeMin(s.ageMin);
      if (typeof s.ageMax === "number") setAgeMax(s.ageMax);
      if (Array.isArray(s.likes)) setLikes(s.likes);
    } catch {}
  }, []);

  const save = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "bond.settings",
        JSON.stringify({ distance, global, countries, gender, ageMin, ageMax, likes }),
      );
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const toggleCountry = (c: string) =>
    setCountries((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  const toggleLike = (l: string) =>
    setLikes((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));

  const tabs: { id: Tab; label: string; icon: typeof MapPin }[] = [
    { id: "distance", label: t("settings.tab.distance"), icon: MapPin },
    { id: "countries", label: t("settings.tab.countries"), icon: Globe2 },
    { id: "match", label: t("settings.tab.match"), icon: Heart },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <div className="text-sm text-muted-foreground">{t("settings.title")}</div>
        <h1 className="font-display text-3xl sm:text-4xl font-medium mt-1">
          {t("settings.subtitle")}
        </h1>
      </div>

      <div className="flex gap-1.5 p-1.5 rounded-full bg-muted w-fit mb-6 overflow-x-auto">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-all ${
              tab === tb.id ? "bg-background shadow-soft text-foreground" : "text-muted-foreground"
            }`}
          >
            <tb.icon className="h-3.5 w-3.5" /> {tb.label}
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8"
      >
        {tab === "distance" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">{t("settings.distance.label")}</label>
                <span className="text-sm text-muted-foreground">{global ? "∞" : `${distance} km`}</span>
              </div>
              <input
                type="range"
                min={1}
                max={500}
                value={distance}
                disabled={global}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-[var(--color-coral)]"
              />
              <p className="text-xs text-muted-foreground mt-2">{t("settings.distance.hint")}</p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={global}
                onChange={(e) => setGlobal(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-coral)]"
              />
              <span className="text-sm">{t("settings.distance.global")}</span>
            </label>
          </div>
        )}

        {tab === "countries" && (
          <div>
            <label className="text-sm font-medium">{t("settings.countries.label")}</label>
            <p className="text-xs text-muted-foreground mt-1 mb-4">{t("settings.countries.hint")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_COUNTRIES.map((co) => {
                const on = countries.includes(co.c);
                return (
                  <button
                    key={co.c}
                    onClick={() => toggleCountry(co.c)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all ${
                      on
                        ? "border-transparent bg-foreground text-background"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <span className="text-base">{co.flag}</span>
                    <span className="flex-1 text-left">{co.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === "match" && (
          <div className="space-y-7">
            <div>
              <label className="text-sm font-medium">{t("settings.match.gender")}</label>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { id: "women", label: t("settings.gender.women") },
                  { id: "men", label: t("settings.gender.men") },
                  { id: "nonbinary", label: t("settings.gender.nonbinary") },
                  { id: "everyone", label: t("settings.gender.everyone") },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGender(g.id)}
                    className={`rounded-full px-4 py-2 text-sm border transition-all ${
                      gender === g.id
                        ? "bg-gradient-coral text-white border-transparent shadow-glow"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">{t("settings.match.age")}</label>
                <span className="text-sm text-muted-foreground">{ageMin} – {ageMax}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Min</div>
                  <input
                    type="range" min={18} max={ageMax - 1} value={ageMin}
                    onChange={(e) => setAgeMin(Number(e.target.value))}
                    className="w-full accent-[var(--color-coral)]"
                  />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Max</div>
                  <input
                    type="range" min={ageMin + 1} max={80} value={ageMax}
                    onChange={(e) => setAgeMax(Number(e.target.value))}
                    className="w-full accent-[var(--color-coral)]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">{t("settings.match.likes")}</label>
              <p className="text-xs text-muted-foreground mt-1 mb-3">{t("settings.match.likes.hint")}</p>
              <div className="flex flex-wrap gap-1.5">
                {LIKES.map((l) => {
                  const on = likes.includes(l);
                  return (
                    <button
                      key={l}
                      onClick={() => toggleLike(l)}
                      className={`text-xs rounded-full px-3 py-1.5 border transition-all ${
                        on
                          ? "bg-foreground text-background border-transparent"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-end gap-3">
          {saved && <span className="text-xs text-muted-foreground">✓</span>}
          <button
            onClick={save}
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Save className="h-4 w-4" /> {t("settings.save")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}