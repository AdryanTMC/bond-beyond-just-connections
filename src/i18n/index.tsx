import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dictionaries, formatPrice, type Lang } from "./dictionaries";

export type { Lang } from "./dictionaries";

export const LANGUAGES: { code: Lang; label: string; flag: string; country: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸", country: "US" },
  { code: "pt", label: "Português", flag: "🇧🇷", country: "BR" },
  { code: "es", label: "Español", flag: "🇪🇸", country: "ES" },
  { code: "fr", label: "Français", flag: "🇫🇷", country: "FR" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", country: "DE" },
  { code: "it", label: "Italiano", flag: "🇮🇹", country: "IT" },
  { code: "ja", label: "日本語", flag: "🇯🇵", country: "JP" },
  { code: "ko", label: "한국어", flag: "🇰🇷", country: "KR" },
];

type Ctx = {
  lang: Lang;
  country: string;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  price: (usd: number) => string;
};
const LanguageContext = createContext<Ctx | null>(null);

function langFromLocale(loc: string): Lang | null {
  const lower = loc.toLowerCase();
  if (lower.startsWith("pt")) return "pt";
  if (lower.startsWith("es")) return "es";
  if (lower.startsWith("fr")) return "fr";
  if (lower.startsWith("de")) return "de";
  if (lower.startsWith("it")) return "it";
  if (lower.startsWith("ja")) return "ja";
  if (lower.startsWith("ko")) return "ko";
  if (lower.startsWith("en")) return "en";
  return null;
}

function detectCountry(): string {
  if (typeof window === "undefined") return "US";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Sao_Paulo") || tz.includes("Brazil")) return "BR";
    if (tz.includes("Tokyo")) return "JP";
    if (tz.includes("Seoul")) return "KR";
    if (tz.includes("Paris")) return "FR";
    if (tz.includes("Berlin")) return "DE";
    if (tz.includes("Rome")) return "IT";
    if (tz.includes("Madrid")) return "ES";
  } catch {}
  const loc = (navigator.language || "en-US").split("-");
  return (loc[1] || "US").toUpperCase();
}

function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem("bond.lang") as Lang | null;
  if (stored && dictionaries[stored]) return stored;
  const langs = [navigator.language, ...(navigator.languages || [])];
  for (const l of langs) {
    const m = langFromLocale(l || "");
    if (m) return m;
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [country, setCountry] = useState<string>("US");

  useEffect(() => {
    setLangState(detectLang());
    setCountry(detectCountry());
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("bond.lang", l);
      document.documentElement.lang = l;
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<Ctx>(() => ({
    lang,
    country,
    setLang,
    t: (k) => dictionaries[lang][k] ?? dictionaries.en[k] ?? k,
    price: (usd) => formatPrice(usd, country),
  }), [lang, country]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) return {
    lang: "en" as Lang,
    country: "US",
    setLang: () => {},
    t: (k: string) => dictionaries.en[k] ?? k,
    price: (usd: number) => formatPrice(usd, "US"),
  };
  return ctx;
}