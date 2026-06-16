'use client';

import { useMemo } from 'react';

import { useAuthContext } from '@/contexts/auth-context';
import { resolveAvatarUrl } from '@/lib/auth/avatar';
import { extractOAuthAvatar } from '@/lib/auth/extract-auth-profile';

export function useProfile() {
  const { user, profile, loading, initialized, refreshProfile } = useAuthContext();

  const oauthAvatar = user ? extractOAuthAvatar(user) : null;
  const avatarUrl = useMemo(
    () => resolveAvatarUrl(oauthAvatar, profile?.avatar_url),
    [oauthAvatar, profile?.avatar_url],
  );

  const displayName = useMemo(() => {
    if (profile?.full_name?.trim()) return profile.full_name.trim();
    if (user?.user_metadata?.full_name && typeof user.user_metadata.full_name === 'string') {
      return user.user_metadata.full_name.trim();
    }
    return user?.email?.split('@')[0] ?? '';
  }, [profile?.full_name, user]);

  return {
    profile,
    displayName,
    email: profile?.email ?? user?.email ?? '',
    avatarUrl,
    loading,
    initialized,
    refreshProfile,
  };
}
