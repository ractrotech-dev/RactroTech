'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function NavbarAuthSkeleton() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <Skeleton className="h-9 w-9 rounded-full border-2 border-black/20 bg-yellow-100" />
      <Skeleton className="hidden h-9 w-9 rounded-full border-2 border-black/20 bg-yellow-100 md:block" />
    </div>
  );
}
