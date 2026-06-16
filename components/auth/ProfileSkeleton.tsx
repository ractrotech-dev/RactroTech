'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-8" aria-busy="true" aria-label="Loading profile">
      <Skeleton className="h-8 w-40 bg-yellow-100" />
      <div className="retro-border space-y-4 border-4 border-black/10 bg-white p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full bg-yellow-100" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48 bg-yellow-100" />
            <Skeleton className="h-4 w-56 bg-yellow-100" />
          </div>
        </div>
        <Skeleton className="h-10 w-full bg-yellow-100" />
        <Skeleton className="h-10 w-full bg-yellow-100" />
        <Skeleton className="h-10 w-full bg-yellow-100" />
      </div>
    </div>
  );
}
