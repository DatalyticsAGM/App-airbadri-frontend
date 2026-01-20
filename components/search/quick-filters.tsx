/**
 * Quick Filters Component
 * 
 * Componente de filtros rápidos para búsqueda.
 * Permite aplicar filtros comunes con un solo click.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { PropertyFilters } from '@/lib/properties/types';
import { cn } from '@/lib/utils';

interface QuickFiltersProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  activeFilters: PropertyFilters;
}

/**
 * Filtros rápidos predefinidos
 */
const QUICK_FILTERS = [
  { id: 'low-price', label: 'Precio bajo', filter: { priceRange: { min: 0, max: 50 } } },
  { id: 'high-rating', label: 'Mejor valorado', filter: { minRating: 4 } },
  { id: 'new', label: 'Nuevo', filter: {} }, // Se ordenará por fecha
];

/**
 * Tipos de propiedad comunes
 */
const PROPERTY_TYPES = [
  'Casa completa',
  'Apartamento',
  'Habitación privada',
  'Loft',
  'Villa',
];

/**
 * Amenities populares
 */
const POPULAR_AMENITIES = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'parking', label: 'Parking' },
  { id: 'pool', label: 'Piscina' },
  { id: 'kitchen', label: 'Cocina' },
  { id: 'ac', label: 'Aire acondicionado' },
];

export function QuickFilters({ onFiltersChange, activeFilters }: QuickFiltersProps) {
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    activeFilters.propertyType ? [activeFilters.propertyType] : []
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    activeFilters.amenities || []
  );

  /**
   * Maneja el click en un filtro rápido
   */
  const handleQuickFilter = (filterId: string, filter: PropertyFilters) => {
    if (activeQuickFilter === filterId) {
      // Si ya está activo, desactivarlo
      setActiveQuickFilter(null);
      onFiltersChange({});
    } else {
      // Activar el filtro
      setActiveQuickFilter(filterId);
      onFiltersChange(filter);
    }
  };

  /**
   * Maneja la selección de tipo de propiedad
   */
  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];

    setSelectedTypes(newTypes);

    // Actualizar filtros
    const newFilters: PropertyFilters = {
      ...activeFilters,
      propertyType: newTypes.length === 1 ? newTypes[0] : undefined,
    };

    onFiltersChange(newFilters);
  };

  /**
   * Maneja la selección de amenities
   */
  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];

    setSelectedAmenities(newAmenities);

    // Actualizar filtros
    const newFilters: PropertyFilters = {
      ...activeFilters,
      amenities: newAmenities.length > 0 ? newAmenities : undefined,
    };

    onFiltersChange(newFilters);
  };

  /**
   * Limpia todos los filtros
   */
  const handleClearAll = () => {
    setActiveQuickFilter(null);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    onFiltersChange({});
  };

  // Contar filtros activos
  const activeFiltersCount =
    (activeQuickFilter ? 1 : 0) +
    selectedTypes.length +
    selectedAmenities.length;

  return (
    <div className="space-y-4">
      {/* Filtros rápidos */}
      <div>
        <h3 className="text-sm font-semibold text-airbnb-text-100 mb-2">
          Filtros rápidos
        </h3>
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((filter) => (
            <Button
              key={filter.id}
              type="button"
              variant={activeQuickFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleQuickFilter(filter.id, filter.filter)}
              className={cn(
                activeQuickFilter === filter.id &&
                  'bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white'
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tipos de propiedad */}
      <div>
        <h3 className="text-sm font-semibold text-airbnb-text-100 mb-2">
          Tipo de propiedad
        </h3>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <Badge
              key={type}
              variant={selectedTypes.includes(type) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer px-3 py-1',
                selectedTypes.includes(type) &&
                  'bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white'
              )}
              onClick={() => handleTypeToggle(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Amenities populares */}
      <div>
        <h3 className="text-sm font-semibold text-airbnb-text-100 mb-2">
          Amenities
        </h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR_AMENITIES.map((amenity) => (
            <Badge
              key={amenity.id}
              variant={selectedAmenities.includes(amenity.id) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer px-3 py-1',
                selectedAmenities.includes(amenity.id) &&
                  'bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white'
              )}
              onClick={() => handleAmenityToggle(amenity.id)}
            >
              {amenity.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Botón limpiar filtros */}
      {activeFiltersCount > 0 && (
        <div className="pt-2 border-t border-airbnb-bg-300">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="w-full gap-2"
          >
            <X className="w-4 h-4" />
            Limpiar todos los filtros ({activeFiltersCount})
          </Button>
        </div>
      )}
    </div>
  );
}



