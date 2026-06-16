import { ProfileSettings } from '@/components/auth/ProfileSettings';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Account Settings',
  description: 'Update your RactroTech profile and preferences.',
  noIndex: true,
});

export default function AccountSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight">Settings</h1>
      <p className="mt-2 text-sm font-semibold text-black/70">
        Update your profile, social links, and avatar.
      </p>
      <div className="retro-border mt-8 border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:p-8">
        <ProfileSettings />
      </div>
    </div>
  );
}
