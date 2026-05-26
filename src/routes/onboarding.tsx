import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Loader2, Camera, X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";

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

type Step = 0 | 1 | 2 | 3 | 4 | 5;

function Onboarding() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: pLoading, refresh } = useProfile();
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
    0: () => (displayName.trim().length < 2 ? "Enter your name" : null),
    1: () => {
      if (!birthdate) return "Select your birthdate";
      const age = computeAge(birthdate);
      if (age < 18) return "You must be 18+ to use Bond";
      if (age > 100) return "Invalid date";
      return null;
    },
    2: () => (!gender || !seeking ? "Select gender and who you want to meet" : null),
    3: () => (interests.length < 3 ? "Choose at least 3 interests" : null),
    4: () => (city.trim().length < 2 ? "Enter your city" : null),
    5: () => (photos.length < 2 ? "Add at least 2 photos" : null),
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
        <span className="text-xs text-muted-foreground">Step {step + 1} / 6</span>
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
              <Field title="What's your name?" subtitle="This is how people will see you.">
                <input
                  autoFocus
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your first name"
                  maxLength={40}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-base focus:outline-none focus:border-foreground/40"
                />
              </Field>
            )}
            {step === 1 && (
              <Field title="When were you born?" subtitle="You must be 18 or older.">
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
              <Field title="Tell us about you" subtitle="Pick your gender and who you'd like to meet.">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">I am</div>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {GENDERS.map((g) => (
                    <Chip key={g} active={gender === g} onClick={() => setGender(g)}>
                      {g === "nonbinary" ? "Non-binary" : g.charAt(0).toUpperCase() + g.slice(1)}
                    </Chip>
                  ))}
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Show me</div>
                <div className="grid grid-cols-3 gap-2">
                  {SEEKING.map((s) => (
                    <Chip key={s} active={seeking === s} onClick={() => setSeeking(s)}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Chip>
                  ))}
                </div>
              </Field>
            )}
            {step === 3 && (
              <Field title="What do you love?" subtitle="Pick 3–8 interests.">
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <Chip key={i} active={interests.includes(i)} onClick={() => toggleInterest(i)}>
                      {i}
                    </Chip>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">{interests.length}/8 selected</p>
              </Field>
            )}
            {step === 4 && (
              <Field title="Where are you?" subtitle="Helps us find people nearby. Phone is optional.">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  maxLength={60}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-base focus:outline-none focus:border-foreground/40 mb-3"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone (optional, e.g. +55 11 99999-0000)"
                  maxLength={30}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-base focus:outline-none focus:border-foreground/40 mb-3"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short bio (optional)"
                  maxLength={300}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-foreground/40 resize-none"
                />
              </Field>
            )}
            {step === 5 && (
              <Field title="Add your photos" subtitle="At least 2 photos so people can know you.">
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
                          <span className="text-[10px]">Add</span>
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
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <button
            onClick={next}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-coral text-white px-6 py-3 text-sm font-medium shadow-glow disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : step === 5 ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {step === 5 ? "Finish" : "Continue"}
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