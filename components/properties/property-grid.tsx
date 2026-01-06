/**
 * Property Grid Component
 * 
 * Componente para mostrar un grid de propiedades
 */

'use client';

import { PropertyCard } from './property-card';
import type { Property } from '@/lib/properties/types';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
}

export function PropertyGrid({ properties, loading = false }: PropertyGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md">
            <Skeleton className="h-64 w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-airbnb-text-200 mb-4">
          No se encontraron propiedades
        </p>
        <p className="text-sm text-airbnb-text-200">
          Intenta ajustar tus filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

