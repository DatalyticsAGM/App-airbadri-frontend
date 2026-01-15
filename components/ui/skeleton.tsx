/**
 * Skeleton Loader Component
 * 
 * Componente para mostrar estados de carga
 */

import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-airbnb-bg-300', className)}
      {...props}
    />
  );
}

export { Skeleton };
