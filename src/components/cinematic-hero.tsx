import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Globe, Lock, Infinity as InfinityIcon, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLang } from "@/i18n";
import romance from "@/assets/banner-romance.webp";
import friends from "@/assets/banner-friends.webp";
import community from "@/assets/banner-community.jpg";

const banners = [romance, friends, community];

export function CinematicHero() {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const [headlineI, setHeadlineI] = useState(0);
  const headlines = [t("hero.rot.1"), t("hero.rot.2"), t("hero.rot.3"), t("hero.rot.4")];

  useEffect(() => {
    const a = setInterval(() => setI((v) => (v + 1) % banners.length), 6500);
    const b = setInterval(() => setHeadlineI((v) => (v + 1) % 4), 4200);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center pt-32 pb-20 overflow-hidden">
      {/* Cinematic background with slow zoom + crossfade */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="sync">
          <motion.img
            key={i}
            src={banners[i]}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={i === 0 ? "high" : "low"}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1.12 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.8 }, scale: { duration: 9, ease: "linear" } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
      </div>

      {/* Floating particles */}
      <Particles />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 w-full grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground mb-7">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-coral animate-pulse" />
            {t("hero.badge")}
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.02] tracking-tight min-h-[3.5em] sm:min-h-[2.6em] lg:min-h-[2.2em]">
            <AnimatePresence mode="wait">
              <motion.span
                key={headlineI}
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="block text-gradient-coral"
              >
                {headlines[headlineI]}
              </motion.span>
            </AnimatePresence>
          </h1>

          <p className="mt-7 max-w-xl text-lg text-muted-foreground leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/app"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3.5 text-sm font-medium hover:opacity-90 transition-all shadow-glow"
            >
              {t("hero.cta.primary")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium">
              <Sparkles className="h-4 w-4" /> {t("hero.cta.secondary")}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> {t("landing.trust.langs")}</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> {t("landing.trust.private")}</span>
            <span className="inline-flex items-center gap-1.5"><InfinityIcon className="h-3.5 w-3.5" /> {t("landing.trust.memories")}</span>
          </div>
        </motion.div>

        {/* Indicator dots */}
        <div className="hidden lg:flex lg:col-span-5 justify-end items-end h-full">
          <div className="flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-1 rounded-full transition-all ${idx === i ? "w-10 bg-foreground" : "w-5 bg-foreground/25"}`}
                aria-label={`Banner ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Particles() {
  const dots = Array.from({ length: 10 });
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      {dots.map((_, i) => {
        const left = (i * 47) % 100;
        const top = (i * 71) % 100;
        const size = 2 + (i % 4);
        const delay = (i % 9) * 0.6;
        const dur = 9 + (i % 7);
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: [-10, -60, -120] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "easeOut" }}
            className="absolute rounded-full bg-white/60 mix-blend-screen blur-[1px]"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
          />
        );
      })}
    </div>
  );
}