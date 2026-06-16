import Link from 'next/link';
import { CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Billing',
  description: 'Manage your RactroTech subscription and billing.',
  noIndex: true,
});

export default function AccountBillingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <div className="flex items-center gap-3">
        <CreditCard className="h-8 w-8" strokeWidth={2.5} />
        <h1 className="text-3xl font-black tracking-tight">Billing</h1>
      </div>
      <p className="mt-2 text-sm font-semibold text-black/70">
        View plans, manage subscriptions, and update payment methods.
      </p>
      <div className="retro-border mt-8 space-y-4 border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-sm font-semibold text-black/80">
          Upgrade or change your plan on the subscribe page. Stripe handles secure billing.
        </p>
        <Button asChild className="retro-button border-2 border-black bg-black text-yellow-400">
          <Link href="/subscribe">View plans</Link>
        </Button>
      </div>
    </div>
  );
}
