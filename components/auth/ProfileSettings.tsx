'use client';

import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { ProfileSkeleton } from '@/components/auth/ProfileSkeleton';
import { SignInPrompt } from '@/components/auth/SignInPrompt';
import { UserAvatar } from '@/components/auth/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { updateProfileAction } from '@/app/account/actions';

export function ProfileSettings() {
  const { user } = useAuth();
  const { profile, displayName, email, loading, initialized, refreshProfile } = useProfile();
  const [pending, startTransition] = useTransition();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? '');
    setUsername(profile.username ?? '');
    setBio(profile.bio ?? '');
    setWebsite(profile.website ?? '');
    setGithub(profile.github ?? '');
    setTwitter(profile.twitter ?? '');
    setAvatarUrl(profile.avatar_url ?? '');
  }, [profile]);

  if (!user) {
    return (
      <SignInPrompt
        title="Sign in to manage your profile"
        description="Update your name, avatar, and social links after logging in."
      />
    );
  }

  if (!initialized || loading) {
    return <ProfileSkeleton />;
  }

  const previewProfile = profile
    ? {
        ...profile,
        full_name: fullName || profile.full_name,
        avatar_url: avatarUrl || profile.avatar_url,
        username: username || profile.username,
      }
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateProfileAction({
        full_name: fullName.trim() || null,
        username: username.trim() || null,
        bio: bio.trim() || null,
        website: website.trim() || null,
        github: github.trim() || null,
        twitter: twitter.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      await refreshProfile();
      toast.success('Profile updated.');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <UserAvatar
          user={user}
          profile={previewProfile}
          displayName={fullName || displayName}
          email={email}
          size="lg"
        />
        <div>
          <p className="text-lg font-black tracking-wide">{fullName || displayName}</p>
          <p className="text-sm font-semibold text-black/60">{email}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" id="full_name">
          <Input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="retro-border border-2 border-black"
            placeholder="Your name"
          />
        </Field>
        <Field label="Username" id="username">
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="retro-border border-2 border-black"
            placeholder="username"
          />
        </Field>
        <Field label="Avatar URL" id="avatar_url" className="sm:col-span-2">
          <Input
            id="avatar_url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="retro-border border-2 border-black"
            placeholder="https://..."
          />
        </Field>
        <Field label="Website" id="website">
          <Input
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="retro-border border-2 border-black"
            placeholder="https://yoursite.com"
          />
        </Field>
        <Field label="GitHub" id="github">
          <Input
            id="github"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className="retro-border border-2 border-black"
            placeholder="github.com/you"
          />
        </Field>
        <Field label="Twitter / X" id="twitter">
          <Input
            id="twitter"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="retro-border border-2 border-black"
            placeholder="@handle"
          />
        </Field>
        <Field label="Bio" id="bio" className="sm:col-span-2">
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="retro-border min-h-[100px] border-2 border-black"
            placeholder="Tell us about yourself"
          />
        </Field>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="retro-button border-2 border-black bg-black text-yellow-400 hover:bg-black/90"
      >
        {pending ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
}

function Field({
  label,
  id,
  children,
  className,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 block text-xs font-black tracking-wide text-black/50">
        {label}
      </Label>
      {children}
    </div>
  );
}
