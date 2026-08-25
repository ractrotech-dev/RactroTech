import Link from 'next/link';
import { Heart, Package, Puzzle, Settings, CreditCard } from 'lucide-react';

import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Dashboard',
  description: 'Your RactroTech account dashboard.',
  noIndex: true,
});

const links = [
  { href: '/account/components', label: 'My Components', icon: Puzzle, desc: 'Components you have created' },
  { href: '/account/favorites', label: 'Favorites', icon: Heart, desc: 'Saved components and templates' },
  { href: '/account/purchases', label: 'Purchases', icon: Package, desc: 'Your purchase history' },
  { href: '/account/billing', label: 'Billing', icon: CreditCard, desc: 'Plans and payment methods' },
  { href: '/account/settings', label: 'Settings', icon: Settings, desc: 'Profile and account preferences' },
];

export default function AccountDashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Dashboard</h1>
      <p className="mt-2 text-sm font-semibold text-black/70">
        Welcome back. Manage your account, components, and subscriptions.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {links.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="retro-border group border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:bg-yellow-50"
          >
            <Icon className="mb-3 h-6 w-6" strokeWidth={2.5} />
            <h2 className="text-lg font-black tracking-wide">{label}</h2>
            <p className="mt-1 text-sm font-semibold text-black/60">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
