'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56 bg-yellow-100" />
        <Skeleton className="h-4 w-72 bg-yellow-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="retro-border border-4 border-black/10 bg-white p-6">
            <Skeleton className="mb-3 h-6 w-24 bg-yellow-100" />
            <Skeleton className="h-4 w-full bg-yellow-100" />
            <Skeleton className="mt-2 h-4 w-3/4 bg-yellow-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
