import { Package } from 'lucide-react';

import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Purchases',
  description: 'View your RactroTech purchase history.',
  noIndex: true,
});

export default function AccountPurchasesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <div className="flex items-center gap-3">
        <Package className="h-8 w-8" strokeWidth={2.5} />
        <h1 className="text-3xl font-black tracking-tight">Purchases</h1>
      </div>
      <p className="mt-2 text-sm font-semibold text-black/70">
        Your purchase history and receipts will appear here.
      </p>
      <div className="retro-border mt-8 border-4 border-dashed border-black/30 bg-yellow-50/50 p-10 text-center">
        <p className="font-bold text-black/60">No purchases yet</p>
      </div>
    </div>
  );
}
