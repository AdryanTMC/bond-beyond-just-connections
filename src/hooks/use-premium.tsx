import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Ctx = { premium: boolean; setPremium: (v: boolean) => void; toggle: () => void };
const PremiumContext = createContext<Ctx | null>(null);

export function PremiumProvider({ children }: { children: ReactNode }) {
  // Real product behavior: users start on the Free plan until they upgrade.
  const [premium, setPremiumState] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("bond.premium");
    if (stored !== null) setPremiumState(stored === "1");
  }, []);

  const setPremium = (v: boolean) => {
    setPremiumState(v);
    if (typeof window !== "undefined") window.localStorage.setItem("bond.premium", v ? "1" : "0");
  };

  return (
    <PremiumContext.Provider value={{ premium, setPremium, toggle: () => setPremium(!premium) }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) return { premium: false, setPremium: () => {}, toggle: () => {} };
  return ctx;
}