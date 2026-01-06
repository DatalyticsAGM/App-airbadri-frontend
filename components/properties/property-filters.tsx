/**
 * Property Filters Component
 * 
 * Componente para filtrar propiedades por ubicación, precio, amenities, etc.
 */

'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { PropertyFilters } from '@/lib/properties/types';

interface PropertyFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  onClearFilters: () => void;
}

const availableAmenities = [
  'WiFi',
  'Aire acondicionado',
  'Cocina equipada',
  'TV',
  'Lavadora',
  'Piscina',
  'Parking',
  'Jardín',
  'Chimenea',
  'Balcón',
  'Terraza',
];

export function PropertyFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
}: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters);

  const handleLocationChange = (value: string) => {
    const newFilters = { ...localFilters, location: value || undefined };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (values: number[]) => {
    const newFilters = {
      ...localFilters,
      priceRange: { min: values[0], max: values[1] },
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = localFilters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    const newFilters = {
      ...localFilters,
      amenities: newAmenities.length > 0 ? newAmenities : undefined,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClear = () => {
    const emptyFilters: PropertyFilters = {};
    setLocalFilters(emptyFilters);
    onClearFilters();
  };

  const hasActiveFilters = 
    localFilters.location ||
    localFilters.priceRange ||
    (localFilters.amenities && localFilters.amenities.length > 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-airbnb-text-100">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-airbnb-primary-100 hover:text-airbnb-primary-100/80"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Location Filter */}
        <div>
          <Label htmlFor="location" className="mb-2 block text-sm font-medium text-airbnb-text-100">
            Ubicación
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-airbnb-text-200" />
            <Input
              id="location"
              type="text"
              placeholder="Ciudad, país..."
              value={localFilters.location || ''}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <Label className="mb-2 block text-sm font-medium text-airbnb-text-100">
            Rango de precio (€/noche)
          </Label>
          <Slider
            min={0}
            max={500}
            step={10}
            value={[
              localFilters.priceRange?.min || 0,
              localFilters.priceRange?.max || 500,
            ]}
            onValueChange={(values) => handlePriceRangeChange(values)}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-airbnb-text-200">
            <span>€{localFilters.priceRange?.min || 0}</span>
            <span>€{localFilters.priceRange?.max || 500}</span>
          </div>
        </div>

        {/* Amenities Filter */}
        <div>
          <Label className="mb-3 block text-sm font-medium text-airbnb-text-100">
            Amenities
          </Label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={localFilters.amenities?.includes(amenity) || false}
                  onCheckedChange={() => handleAmenityToggle(amenity)}
                />
                <Label
                  htmlFor={`amenity-${amenity}`}
                  className="text-sm text-airbnb-text-200 cursor-pointer"
                >
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

