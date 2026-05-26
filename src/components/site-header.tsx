import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LANGUAGES, useLang, type Lang } from "@/i18n";
import { BondLogo } from "@/components/bond-logo";

export function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 transition-all ${scrolled ? "py-2.5" : "py-4"}`}>
        <div className={`glass rounded-full flex items-center justify-between gap-3 px-3 sm:px-5 py-2.5 transition-shadow ${scrolled ? "shadow-elegant" : "shadow-soft"}`}>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <BondLogo size={32} />
            <span className="font-display text-xl font-semibold tracking-tight">{t("brand.name")}</span>
            <span className="hidden sm:inline text-xs text-muted-foreground ml-1">{t("brand.tagline")}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="/#features" className="hover:text-foreground transition-colors">{t("nav.features")}</a>
            <a href="/#circles" className="hover:text-foreground transition-colors">{t("nav.circles")}</a>
            <a href="/#pricing" className="hover:text-foreground transition-colors">{t("nav.pricing")}</a>
            <Link to="/app" className="hover:text-foreground transition-colors">{t("nav.openApp")}</Link>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <LangSelector lang={lang} onChange={setLang} />
            <Link to="/app" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-2">
              {t("nav.login")}
            </Link>
            <Link
              to="/app"
              className="rounded-full bg-foreground text-background px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {t("nav.cta")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function LangSelector({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs hover:bg-foreground/5 transition-colors"
        aria-label="Change language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline font-medium uppercase tracking-wider">{current.code}</span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-52 rounded-2xl glass shadow-elegant p-1.5 z-50"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { onChange(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                  l.code === lang ? "bg-foreground/5 text-foreground" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span className="flex-1 text-left">{l.label}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-60">{l.country}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
