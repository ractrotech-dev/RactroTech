'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

import type { UserProfile } from '@/lib/auth/profile-types';
import { extractFullName, extractOAuthAvatar } from '@/lib/auth/extract-auth-profile';
import { createClient } from '@/utils/supabase/client';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapProfileRow(row: Record<string, unknown>): UserProfile {
  return {
    id: String(row.id),
    email: String(row.email),
    full_name: (row.full_name as string | null) ?? null,
    username: (row.username as string | null) ?? null,
    avatar_url: (row.avatar_url as string | null) ?? null,
    provider: String(row.provider ?? 'email'),
    bio: (row.bio as string | null) ?? null,
    website: (row.website as string | null) ?? null,
    github: (row.github as string | null) ?? null,
    twitter: (row.twitter as string | null) ?? null,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const handledQueryRef = useRef(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

    if (!error && data) {
      setProfile(mapProfileRow(data as Record<string, unknown>));
      return;
    }
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    await fetchProfile(user.id);
  }, [fetchProfile, user?.id]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    router.push('/?signed_out=1');
    router.refresh();
  }, [router]);

  const displayName = useMemo(() => {
    if (profile?.full_name?.trim()) return profile.full_name.trim();
    if (user) return extractFullName(user) ?? user.email?.split('@')[0] ?? 'there';
    return 'there';
  }, [profile?.full_name, user]);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const applySession = async (nextSession: Session | null) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user?.id) {
        await fetchProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    };

    const init = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      await applySession(initialSession);
      if (mounted) {
        setLoading(false);
        setInitialized(true);
      }
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, nextSession) => {
      await applySession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once; profile name resolved in toasts via session user
  }, [fetchProfile]);

  useEffect(() => {
    if (!initialized || handledQueryRef.current) return;

    const auth = searchParams.get('auth');
    const signedOut = searchParams.get('signed_out');
    const welcome = searchParams.get('welcome');

    const clearParams = (...keys: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      keys.forEach((k) => params.delete(k));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    if (auth === 'google' && user) {
      toast.success('Successfully connected with Google.');
      handledQueryRef.current = true;
      clearParams('auth');
    }

    if (signedOut === '1') {
      toast.info('You have been signed out.');
      handledQueryRef.current = true;
      clearParams('signed_out');
    }

    if (welcome === '1' && user) {
      const name =
        profile?.full_name?.trim() ||
        extractFullName(user) ||
        user.email?.split('@')[0] ||
        'there';
      toast.success(`Welcome back, ${name}`);
      handledQueryRef.current = true;
      clearParams('welcome');
    }
  }, [initialized, pathname, profile?.full_name, router, searchParams, user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      loading,
      initialized,
      refreshProfile,
      signOut,
    }),
    [user, session, profile, loading, initialized, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
}

export function useAuthDisplayName(): string {
  const { user, profile } = useAuthContext();
  if (profile?.full_name?.trim()) return profile.full_name.trim();
  if (user) return extractFullName(user) ?? user.email?.split('@')[0] ?? '';
  return '';
}
