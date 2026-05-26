import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Heart, Home, Compass, MessageCircle, User, Crown, Bell, Plus, Sparkles, Fingerprint, Settings as SettingsIcon, LogOut, Loader2,
} from "lucide-react";
import { useLang, LANGUAGES, type Lang } from "@/i18n";
import { usePremium } from "@/hooks/use-premium";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BondLogo } from "@/components/bond-logo";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Bond — Your relationships" },
      { name: "description", content: "Your circles, discoveries, conversations and capsules — in one calm place." },
    ],
  }),
  component: AppLayout,
});

const nav = [
  { to: "/app", labelKey: "app.nav.home", icon: Home, exact: true },
  { to: "/app/discover", labelKey: "app.nav.discover", icon: Compass },
  { to: "/app/identity", labelKey: "app.nav.identity", icon: Fingerprint },
  { to: "/app/messages", labelKey: "app.nav.messages", icon: MessageCircle },
  { to: "/app/profile", labelKey: "app.nav.profile", icon: User },
  { to: "/app/settings", labelKey: "app.nav.settings", icon: SettingsIcon },
  { to: "/app/premium", labelKey: "app.nav.premium", icon: Crown },
] as const;

function AppLayout() {
  const { t, lang, setLang } = useLang();
  const { premium, toggle } = usePremium();
  const { user, loading, signOut } = useAuth();
  const { profile, loading: pLoading } = useProfile();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
    if (!loading && user && !pLoading && profile && !profile.onboarding_completed) {
      navigate({ to: "/onboarding", replace: true });
    }
  }, [loading, user, pLoading, profile, navigate]);

  if (loading || !user || pLoading || (profile && !profile.onboarding_completed)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border/60 min-h-screen p-5 sticky top-0 self-start">
          <Link to="/" className="flex items-center gap-2 mb-9">
            <BondLogo size={36} />
            <span className="font-display text-xl font-semibold">{t("brand.name")}</span>
          </Link>

          <nav className="space-y-1 text-sm">
            {nav.map((n) => {
              const active = isActive(n.to, "exact" in n ? n.exact : false);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    active ? "bg-foreground text-background" : "hover:bg-foreground/5 text-foreground/80"
                  }`}
                >
                  <n.icon className="h-4 w-4" strokeWidth={1.75} />
                  {t(n.labelKey)}
                </Link>
              );
            })}
          </nav>

          <Link
            to="/app/premium"
            className="mt-auto rounded-2xl bg-gradient-hero p-4 text-ivory block hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center gap-1.5 text-xs opacity-80"><Sparkles className="h-3 w-3" /> Bond Infinity</div>
            <div className="font-display text-base mt-1">Unlock the full premium</div>
            <div className="mt-3 w-full rounded-full bg-ivory text-midnight text-xs py-2 font-medium text-center">Upgrade</div>
          </Link>
        </aside>

        <main className="flex-1 min-w-0">
          {/* Topbar */}
          <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
            <div className="px-4 sm:px-6 lg:px-10 py-3.5 flex items-center gap-3">
              <div className="flex-1" />
              <AppLangSelector lang={lang} onChange={setLang} />
              <button
                onClick={toggle}
                title={t("premium.toggle.hint")}
                className={`hidden sm:inline-flex items-center gap-1.5 h-10 rounded-full px-3 text-xs font-medium transition-all ${
                  premium
                    ? "bg-gradient-coral text-white shadow-glow"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Crown className="h-3.5 w-3.5" />
                {premium ? t("premium.toggle.on") : t("premium.toggle.off")}
              </button>
              <button className="relative h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-coral" />
              </button>
              <button
                onClick={() => signOut().then(() => navigate({ to: "/login", replace: true }))}
                title="Sign out"
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
              <button className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2.5 text-sm font-medium">
                <Plus className="h-4 w-4" /> {t("app.newBond")}
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-7xl pb-28 lg:pb-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="grid grid-cols-7">
          {nav.map((n) => {
            const active = isActive(n.to, "exact" in n ? n.exact : false);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <n.icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
                {t(n.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function AppLangSelector({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
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
        className="flex items-center gap-1.5 h-10 rounded-full bg-muted px-3 text-xs"
        aria-label="Change language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden md:inline font-medium uppercase tracking-wider">{current.code}</span>
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