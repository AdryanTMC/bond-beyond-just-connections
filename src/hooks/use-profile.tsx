import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type Profile = {
  id: string;
  display_name: string | null;
  bio: string | null;
  birthdate: string | null;
  gender: string | null;
  seeking: string | null;
  city: string | null;
  country: string | null;
  interests: string[] | null;
  photos: string[] | null;
  min_age: number | null;
  max_age: number | null;
  is_active: boolean;
  onboarding_completed: boolean;
};

type Ctx = {
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const ProfileCtx = createContext<Ctx>({ profile: null, loading: true, refresh: async () => {} });

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Use security-definer RPC so the owner can read sensitive fields
    // (birthdate, seeking, min_age, max_age, last_seen_at, onboarding_completed)
    // that are not exposed via column-level grants.
    const { data } = await supabase.rpc("get_my_profile");
    const row = Array.isArray(data) ? data[0] : data;
    setProfile((row as Profile | null) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ProfileCtx.Provider value={{ profile, loading, refresh: load }}>
      {children}
    </ProfileCtx.Provider>
  );
}

export const useProfile = () => useContext(ProfileCtx);