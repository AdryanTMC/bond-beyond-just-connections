import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Loader2, Camera, X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useLang } from "@/i18n";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Bond — Complete your profile" }] }),
  component: Onboarding,
});

const GENDERS = ["woman", "man", "nonbinary", "other"] as const;
const SEEKING = ["women", "men", "everyone"] as const;
const INTERESTS = [
  "Travel", "Music", "Cinema", "Books", "Art", "Coffee", "Wine", "Cooking",
  "Fitness", "Yoga", "Running", "Hiking", "Photography", "Design", "Tech",
  "Gaming", "Dancing", "Theater", "Nature", "Pets", "Spirituality", "Fashion",
];

// Inline translations for the onboarding flow (covers all supported locales)
const I18N = {
  en: { step: "Step", of: "/", back: "Back", continue: "Continue", finish: "Finish",
    titleName: "What's your name?", subName: "This is how people will see you.", phName: "Your first name",
    titleBday: "When were you born?", subBday: "You must be 18 or older.",
    titleAbout: "Tell us about you", subAbout: "Pick your gender and who you'd like to meet.", iam: "I am", showMe: "Show me",
    g_woman: "Woman", g_man: "Man", g_nonbinary: "Non-binary", g_other: "Other",
    s_women: "Women", s_men: "Men", s_everyone: "Everyone",
    titleLove: "What do you love?", subLove: "Pick 3–8 interests.", selected: "selected",
    titleWhere: "Where are you?", subWhere: "Helps us find people nearby. Phone is optional.",
    phCity: "City", phPhone: "Phone (optional)", phBio: "A short bio (optional)",
    titlePhotos: "Add your photos", subPhotos: "At least 1 photo so people can know you.", add: "Add",
    eName: "Enter your name", eBday: "Select your birthdate", eAge: "You must be 18+ to use Bond", eDate: "Invalid date",
    eGender: "Select gender and who you want to meet", eInterests: "Choose at least 3 interests",
    eCity: "Enter your city", ePhoto: "Add at least 1 photo", eUpload: "Upload failed",
    interests: { Travel:"Travel", Music:"Music", Cinema:"Cinema", Books:"Books", Art:"Art", Coffee:"Coffee", Wine:"Wine", Cooking:"Cooking", Fitness:"Fitness", Yoga:"Yoga", Running:"Running", Hiking:"Hiking", Photography:"Photography", Design:"Design", Tech:"Tech", Gaming:"Gaming", Dancing:"Dancing", Theater:"Theater", Nature:"Nature", Pets:"Pets", Spirituality:"Spirituality", Fashion:"Fashion" } },
  pt: { step: "Etapa", of: "de", back: "Voltar", continue: "Continuar", finish: "Concluir",
    titleName: "Qual é o seu nome?", subName: "É assim que as pessoas vão te ver.", phName: "Seu primeiro nome",
    titleBday: "Quando você nasceu?", subBday: "Você precisa ter 18 anos ou mais.",
    titleAbout: "Conte sobre você", subAbout: "Escolha seu gênero e quem deseja conhecer.", iam: "Eu sou", showMe: "Mostrar",
    g_woman: "Mulher", g_man: "Homem", g_nonbinary: "Não-binário", g_other: "Outro",
    s_women: "Mulheres", s_men: "Homens", s_everyone: "Todos",
    titleLove: "O que você ama?", subLove: "Escolha de 3 a 8 interesses.", selected: "selecionados",
    titleWhere: "Onde você está?", subWhere: "Ajuda a encontrar pessoas perto. Telefone é opcional.",
    phCity: "Cidade", phPhone: "Telefone (opcional)", phBio: "Uma bio curta (opcional)",
    titlePhotos: "Adicione suas fotos", subPhotos: "Pelo menos 1 foto para te conhecerem.", add: "Adicionar",
    eName: "Digite seu nome", eBday: "Selecione sua data de nascimento", eAge: "Você precisa ter 18+ para usar o Bond", eDate: "Data inválida",
    eGender: "Escolha o gênero e quem deseja conhecer", eInterests: "Escolha pelo menos 3 interesses",
    eCity: "Digite sua cidade", ePhoto: "Adicione pelo menos 1 foto", eUpload: "Falha no upload",
    interests: { Travel:"Viagem", Music:"Música", Cinema:"Cinema", Books:"Livros", Art:"Arte", Coffee:"Café", Wine:"Vinho", Cooking:"Culinária", Fitness:"Fitness", Yoga:"Yoga", Running:"Corrida", Hiking:"Trilhas", Photography:"Fotografia", Design:"Design", Tech:"Tecnologia", Gaming:"Games", Dancing:"Dança", Theater:"Teatro", Nature:"Natureza", Pets:"Pets", Spirituality:"Espiritualidade", Fashion:"Moda" } },
  es: { step: "Paso", of: "de", back: "Atrás", continue: "Continuar", finish: "Finalizar",
    titleName: "¿Cuál es tu nombre?", subName: "Así te verán las personas.", phName: "Tu nombre",
    titleBday: "¿Cuándo naciste?", subBday: "Debes tener 18 años o más.",
    titleAbout: "Cuéntanos sobre ti", subAbout: "Elige tu género y a quién quieres conocer.", iam: "Soy", showMe: "Mostrar",
    g_woman: "Mujer", g_man: "Hombre", g_nonbinary: "No binarie", g_other: "Otro",
    s_women: "Mujeres", s_men: "Hombres", s_everyone: "Todos",
    titleLove: "¿Qué te encanta?", subLove: "Elige 3–8 intereses.", selected: "seleccionados",
    titleWhere: "¿Dónde estás?", subWhere: "Nos ayuda a encontrar gente cerca. Teléfono opcional.",
    phCity: "Ciudad", phPhone: "Teléfono (opcional)", phBio: "Una bio corta (opcional)",
    titlePhotos: "Añade tus fotos", subPhotos: "Al menos 1 foto para que te conozcan.", add: "Añadir",
    eName: "Escribe tu nombre", eBday: "Selecciona tu fecha", eAge: "Debes ser 18+ para Bond", eDate: "Fecha inválida",
    eGender: "Selecciona género y a quién quieres conocer", eInterests: "Elige al menos 3 intereses",
    eCity: "Escribe tu ciudad", ePhoto: "Añade al menos 1 foto", eUpload: "Error al subir",
    interests: { Travel:"Viajar", Music:"Música", Cinema:"Cine", Books:"Libros", Art:"Arte", Coffee:"Café", Wine:"Vino", Cooking:"Cocina", Fitness:"Fitness", Yoga:"Yoga", Running:"Correr", Hiking:"Senderismo", Photography:"Fotografía", Design:"Diseño", Tech:"Tecnología", Gaming:"Juegos", Dancing:"Baile", Theater:"Teatro", Nature:"Naturaleza", Pets:"Mascotas", Spirituality:"Espiritualidad", Fashion:"Moda" } },
} as const;

type Step = 0 | 1 | 2 | 3 | 4 | 5;

function Onboarding() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: pLoading, refresh } = useProfile();
  const { lang } = useLang();
  const t = ((I18N as unknown) as Record<string, typeof I18N.en>)[lang] ?? I18N.en;
  const [step, setStep] = useState<Step>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState<string>("");
  const [seeking, setSeeking] = useState<string>("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login", replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile?.onboarding_completed) navigate({ to: "/app", replace: true });
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setBirthdate(profile.birthdate ?? "");
      setGender(profile.gender ?? "");
      setSeeking(profile.seeking ?? "");
      setCity(profile.city ?? "");
      setPhone(profile.phone ?? "");
      setBio(profile.bio ?? "");
      setInterests(profile.interests ?? []);
      setPhotos(profile.photos ?? []);
    }
  }, [profile, navigate]);

  const toggleInterest = (i: string) =>
    setInterests((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : cur.length < 8 ? [...cur, i] : cur));

  const uploadPhoto = async (file: File) => {
    if (!user) return;
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("profile-photos").upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("profile-photos").getPublicUrl(path);
      setPhotos((p) => [...p, data.publicUrl]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (url: string) => setPhotos((p) => p.filter((x) => x !== url));

  const computeAge = (d: string) => {
    const date = new Date(d);
    const diff = Date.now() - date.getTime();
    return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
  };

  const validators: Record<Step, () => string | null> = {
    0: () => (displayName.trim().length < 2 ? t.eName : null),
    1: () => {
      if (!birthdate) return t.eBday;
      const age = computeAge(birthdate);
      if (age < 18) return t.eAge;
      if (age > 100) return t.eDate;
      return null;
    },
    2: () => (!gender || !seeking ? t.eGender : null),
    3: () => (interests.length < 3 ? t.eInterests : null),
    4: () => (city.trim().length < 2 ? t.eCity : null),
    5: () => (photos.length < 1 ? t.ePhoto : null),
  };

  const next = () => {
    const err = validators[step]();
    if (err) return setError(err);
    setError(null);
    if (step < 5) setStep((s) => (s + 1) as Step);
    else save();
  };

  const prev = () => {
    setError(null);
    if (step > 0) setStep((s) => (s - 1) as Step);
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    const { error: upErr } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: displayName.trim(),
      birthdate,
      gender,
      seeking,
      city: city.trim(),
      phone: phone.trim() || null,
      bio: bio.trim() || null,
      interests,
      photos,
      onboarding_completed: true,
      is_active: true,
    });
    setSaving(false);
    if (upErr) return setError(upErr.message);
    await refresh();
    navigate({ to: "/app", replace: true });
  };

  if (authLoading || pLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const progress = ((step + 1) / 6) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-5 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-coral shadow-glow">
            <Heart className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold">Bond</span>
        </div>
        <span className="text-xs text-muted-foreground">{t.step} {step + 1} {t.of} 6</span>
      </header>

      <div className="h-1 bg-muted">
        <motion.div
          className="h-full bg-gradient-coral"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      <main className="flex-1 px-5 py-10 max-w-xl w-full mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <Field title={t.titleName} subtitle={t.subName}>
                <input
                  autoFocus
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t.phName}
                  maxLength={40}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-base focus:outline-none focus:border-foreground/40"
                />
              </Field>
            )}
            {step === 1 && (
              <Field title={t.titleBday} subtitle={t.subBday}>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-base focus:outline-none focus:border-foreground/40"
                />
              </Field>
            )}
            {step === 2 && (
              <Field title={t.titleAbout} subtitle={t.subAbout}>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{t.iam}</div>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {GENDERS.map((g) => (
                    <Chip key={g} active={gender === g} onClick={() => setGender(g)}>
                      {t[`g_${g}` as keyof typeof t] as string}
                    </Chip>
                  ))}
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{t.showMe}</div>
                <div className="grid grid-cols-3 gap-2">
                  {SEEKING.map((s) => (
                    <Chip key={s} active={seeking === s} onClick={() => setSeeking(s)}>
                      {t[`s_${s}` as keyof typeof t] as string}
                    </Chip>
                  ))}
                </div>
              </Field>
            )}
            {step === 3 && (
              <Field title={t.titleLove} subtitle={t.subLove}>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <Chip key={i} active={interests.includes(i)} onClick={() => toggleInterest(i)}>
                      {t.interests[i as keyof typeof t.interests] ?? i}
                    </Chip>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">{interests.length}/8 {t.selected}</p>
              </Field>
            )}
            {step === 4 && (
              <Field title={t.titleWhere} subtitle={t.subWhere}>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t.phCity}
                  maxLength={60}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-base focus:outline-none focus:border-foreground/40 mb-3"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phPhone}
                  maxLength={30}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-base focus:outline-none focus:border-foreground/40 mb-3"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t.phBio}
                  maxLength={300}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-foreground/40 resize-none"
                />
              </Field>
            )}
            {step === 5 && (
              <Field title={t.titlePhotos} subtitle={t.subPhotos}>
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((url) => (
                    <div key={url} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removePhoto(url)}
                        className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center"
                        aria-label="Remove"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 6 && (
                    <label className="aspect-[3/4] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors cursor-pointer">
                      {uploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Camera className="h-5 w-5 mb-1" />
                          <span className="text-[10px]">{t.add}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadPhoto(f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>
              </Field>
            )}
          </motion.div>
        </AnimatePresence>

        {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
      </main>

      <footer className="px-5 py-5 border-t border-border/60 bg-card/60 backdrop-blur">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={prev}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> {t.back}
          </button>
          <button
            onClick={next}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-coral text-white px-6 py-3 text-sm font-medium shadow-glow disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : step === 5 ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {step === 5 ? t.finish : t.continue}
          </button>
        </div>
      </footer>
    </div>
  );
}

function Field({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-2 mb-6">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm border transition-all ${
        active
          ? "bg-foreground text-background border-transparent"
          : "border-border bg-card hover:border-foreground/40 text-foreground"
      }`}
    >
      {children}
    </button>
  );
}