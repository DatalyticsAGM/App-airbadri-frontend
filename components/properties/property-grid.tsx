/**
 * Property Grid Component
 * 
 * Componente para mostrar un grid de propiedades
 */

'use client';

import { PropertyCard } from './property-card';
import { PropertyCardSkeleton } from './property-card-skeleton';
import type { Property } from '@/lib/properties/types';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
}

export function PropertyGrid({ properties, loading = false }: PropertyGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <PropertyCardSkeleton key={i} />
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

