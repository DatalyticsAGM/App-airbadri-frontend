/**
 * Property Detail Skeleton
 * 
 * Skeleton loader para PropertyDetail
 */

import { Skeleton } from '@/components/ui/skeleton';

export function PropertyDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Image Gallery Skeleton */}
      <Skeleton className="h-[500px] w-full rounded-2xl" />

      {/* Title and Location Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
      </div>

      {/* Divider */}
      <div className="border-t border-airbnb-bg-300"></div>

      {/* Property Info Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-airbnb-bg-300"></div>

      {/* Description Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
