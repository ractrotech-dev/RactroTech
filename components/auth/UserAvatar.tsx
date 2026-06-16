'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { initialsFromName, resolveAvatarUrl } from '@/lib/auth/avatar';
import { extractOAuthAvatar } from '@/lib/auth/extract-auth-profile';
import type { UserProfile } from '@/lib/auth/profile-types';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

type UserAvatarProps = {
  user?: User | null;
  profile?: UserProfile | null;
  displayName?: string;
  email?: string;
  /** When set, used as uploaded avatar (after OAuth URL in priority). */
  avatarUrlOverride?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
};

export function UserAvatar({
  user,
  profile,
  displayName: displayNameProp,
  email: emailProp,
  avatarUrlOverride,
  size = 'md',
  className,
}: UserAvatarProps) {
  const email = emailProp ?? profile?.email ?? user?.email ?? '';
  const displayName =
    displayNameProp ??
    profile?.full_name?.trim() ??
    (typeof user?.user_metadata?.full_name === 'string' ? user.user_metadata.full_name.trim() : '') ??
    email.split('@')[0] ??
    '';

  const oauthAvatar = user ? extractOAuthAvatar(user) : null;
  const uploaded = avatarUrlOverride ?? profile?.avatar_url;
  const src = resolveAvatarUrl(oauthAvatar, uploaded);
  const initials = initialsFromName(displayName, email);

  return (
    <Avatar className={cn(sizeClasses[size], 'retro-border border-2 border-black', className)}>
      {src ? (
        <AvatarImage src={src} alt="" referrerPolicy="no-referrer" className="object-cover" />
      ) : null}
      <AvatarFallback className="bg-black font-black text-yellow-400">{initials}</AvatarFallback>
    </Avatar>
  );
}
