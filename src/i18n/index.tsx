import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "pt" | "es" | "fr" | "de" | "it";

export const LANGUAGES: { code: Lang; label: string; flag: string; country: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸", country: "US" },
  { code: "pt", label: "Português", flag: "🇧🇷", country: "BR" },
  { code: "es", label: "Español", flag: "🇪🇸", country: "ES" },
  { code: "fr", label: "Français", flag: "🇫🇷", country: "FR" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", country: "DE" },
  { code: "it", label: "Italiano", flag: "🇮🇹", country: "IT" },
];

type Dict = Record<string, string>;

const dictionaries: Record<Lang, Dict> = {
  en: {
    "nav.features": "Features",
    "nav.circles": "Circles",
    "nav.pricing": "Pricing",
    "nav.openApp": "Open app",
    "nav.login": "Log in",
    "nav.cta": "Get early access",
    "hero.badge": "Bond · Laço — now in private beta",
    "hero.title.1": "Relationships",
    "hero.title.2": "that stay.",
    "hero.subtitle": "Bond is the emotional infrastructure for real human connections. Preserve memories, nurture your inner circles, and never lose touch with the people who matter.",
    "hero.cta.primary": "Begin your bonds",
    "hero.cta.secondary": "Discover the platform",
    "hero.rot.1": "Relationships that stay.",
    "hero.rot.2": "More than matches. Real bonds.",
    "hero.rot.3": "Built for the people who matter.",
    "hero.rot.4": "Your emotional world, connected.",
  },
  pt: {
    "nav.features": "Recursos",
    "nav.circles": "Círculos",
    "nav.pricing": "Planos",
    "nav.openApp": "Abrir app",
    "nav.login": "Entrar",
    "nav.cta": "Acesso antecipado",
    "hero.badge": "Laço · Bond — agora em beta privado",
    "hero.title.1": "Relações",
    "hero.title.2": "que permanecem.",
    "hero.subtitle": "Laço é a infraestrutura emocional para conexões humanas reais. Preserve memórias, cuide dos seus círculos e nunca perca contato com quem importa.",
    "hero.cta.primary": "Começar seus laços",
    "hero.cta.secondary": "Conhecer a plataforma",
    "hero.rot.1": "Relações que permanecem.",
    "hero.rot.2": "Mais que matches. Laços reais.",
    "hero.rot.3": "Feito para quem importa.",
    "hero.rot.4": "Seu mundo emocional, conectado.",
  },
  es: {
    "nav.features": "Funciones",
    "nav.circles": "Círculos",
    "nav.pricing": "Planes",
    "nav.openApp": "Abrir app",
    "nav.login": "Iniciar sesión",
    "nav.cta": "Acceso anticipado",
    "hero.badge": "Bond · Laço — en beta privado",
    "hero.title.1": "Relaciones",
    "hero.title.2": "que perduran.",
    "hero.subtitle": "Bond es la infraestructura emocional para conexiones humanas reales. Preserva recuerdos, cultiva tus círculos y nunca pierdas el contacto con quien importa.",
    "hero.cta.primary": "Comienza tus vínculos",
    "hero.cta.secondary": "Descubrir la plataforma",
    "hero.rot.1": "Relaciones que perduran.",
    "hero.rot.2": "Más que matches. Vínculos reales.",
    "hero.rot.3": "Hecho para quien importa.",
    "hero.rot.4": "Tu mundo emocional, conectado.",
  },
  fr: {
    "nav.features": "Fonctions",
    "nav.circles": "Cercles",
    "nav.pricing": "Tarifs",
    "nav.openApp": "Ouvrir l'app",
    "nav.login": "Connexion",
    "nav.cta": "Accès anticipé",
    "hero.badge": "Bond · Laço — en bêta privée",
    "hero.title.1": "Des liens",
    "hero.title.2": "qui durent.",
    "hero.subtitle": "Bond est l'infrastructure émotionnelle des vraies connexions humaines. Préservez vos souvenirs, cultivez vos cercles, ne perdez plus contact avec ceux qui comptent.",
    "hero.cta.primary": "Créer vos liens",
    "hero.cta.secondary": "Découvrir la plateforme",
    "hero.rot.1": "Des liens qui durent.",
    "hero.rot.2": "Plus que des matches. De vrais liens.",
    "hero.rot.3": "Conçu pour ceux qui comptent.",
    "hero.rot.4": "Votre monde émotionnel, connecté.",
  },
  de: {
    "nav.features": "Funktionen",
    "nav.circles": "Kreise",
    "nav.pricing": "Preise",
    "nav.openApp": "App öffnen",
    "nav.login": "Anmelden",
    "nav.cta": "Früher Zugang",
    "hero.badge": "Bond · Laço — jetzt in privater Beta",
    "hero.title.1": "Beziehungen,",
    "hero.title.2": "die bleiben.",
    "hero.subtitle": "Bond ist die emotionale Infrastruktur für echte menschliche Verbindungen. Bewahre Erinnerungen, pflege deine Kreise und verliere nie den Kontakt zu den Menschen, die zählen.",
    "hero.cta.primary": "Beginne deine Bindungen",
    "hero.cta.secondary": "Plattform entdecken",
    "hero.rot.1": "Beziehungen, die bleiben.",
    "hero.rot.2": "Mehr als Matches. Echte Bindungen.",
    "hero.rot.3": "Für die Menschen, die zählen.",
    "hero.rot.4": "Deine emotionale Welt, verbunden.",
  },
  it: {
    "nav.features": "Funzioni",
    "nav.circles": "Cerchie",
    "nav.pricing": "Prezzi",
    "nav.openApp": "Apri app",
    "nav.login": "Accedi",
    "nav.cta": "Accesso anticipato",
    "hero.badge": "Bond · Laço — ora in beta privata",
    "hero.title.1": "Relazioni",
    "hero.title.2": "che restano.",
    "hero.subtitle": "Bond è l'infrastruttura emotiva per connessioni umane reali. Conserva i ricordi, coltiva le tue cerchie e non perdere mai i contatti con chi conta.",
    "hero.cta.primary": "Inizia i tuoi legami",
    "hero.cta.secondary": "Scopri la piattaforma",
    "hero.rot.1": "Relazioni che restano.",
    "hero.rot.2": "Più che match. Legami veri.",
    "hero.rot.3": "Per le persone che contano.",
    "hero.rot.4": "Il tuo mondo emotivo, connesso.",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
const LanguageContext = createContext<Ctx | null>(null);

function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem("bond.lang") as Lang | null;
  if (stored && dictionaries[stored]) return stored;
  const nav = (window.navigator.language || "en").toLowerCase();
  if (nav.startsWith("pt")) return "pt";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("de")) return "de";
  if (nav.startsWith("it")) return "it";
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => { setLangState(detectLang()); }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("bond.lang", l);
  };
  const value = useMemo<Ctx>(() => ({
    lang,
    setLang,
    t: (k) => dictionaries[lang][k] ?? dictionaries.en[k] ?? k,
  }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) return { lang: "en" as Lang, setLang: () => {}, t: (k: string) => dictionaries.en[k] ?? k };
  return ctx;
}