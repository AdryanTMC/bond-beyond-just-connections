import { motion } from "motion/react";
import { Heart, Sparkles, Star } from "lucide-react";

const ICONS = [Heart, Sparkles, Star, Heart, Sparkles] as const;
const COLORS = [
  "text-coral",
  "text-gold",
  "text-romantic",
  "text-coral",
  "text-gold",
];

/**
 * Decorative floating icons (hearts, sparkles, stars) for landing sections.
 * Pure ornamentation — absolutely positioned, pointer-events-none.
 */
export function FloatingCharms({
  count = 12,
  className = "",
}: { count?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 pointer-events-none overflow-hidden -z-0 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => {
        const Icon = ICONS[i % ICONS.length];
        const color = COLORS[i % COLORS.length];
        const size = 14 + ((i * 7) % 22);
        const left = (i * 83 + 7) % 100;
        const top = (i * 47 + 11) % 100;
        const dur = 6 + ((i * 3) % 7);
        const delay = (i % 5) * 0.7;
        const drift = (i % 2 === 0 ? 1 : -1) * (12 + (i % 4) * 6);
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 0.55, 0.85, 0.55, 0],
              y: [20, -30, -10, -40, 20],
              x: [0, drift, -drift / 2, drift, 0],
              rotate: [0, 12, -8, 6, 0],
            }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute ${color}`}
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <Icon style={{ width: size, height: size }} strokeWidth={1.5} />
          </motion.span>
        );
      })}
    </div>
  );
}