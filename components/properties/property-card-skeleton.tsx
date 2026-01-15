/**
 * Property Card Skeleton
 * 
 * Skeleton loader para PropertyCard
 */

import { Skeleton } from '@/components/ui/skeleton';

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md">
      {/* Image Skeleton */}
      <Skeleton className="h-64 w-full" />

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
}

