/**
 * Advanced Search Component
 * 
 * Componente de búsqueda avanzada con múltiples filtros
 */

'use client';

import { useState } from 'react';
import { Search, Calendar, Users, MapPin, X, Wifi, Car, Waves, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import type { PropertyFilters } from '@/lib/properties/types';

interface AdvancedSearchProps {
  onSearch: (filters: PropertyFilters & { searchText?: string; checkIn?: Date; checkOut?: Date; guests?: number }) => void;
  initialFilters?: PropertyFilters;
}

const propertyTypes = [
  'Casa completa',
  'Apartamento',
  'Habitación privada',
  'Habitación compartida',
  'Loft',
  'Villa',
  'Cabaña',
  'Otro',
];

export function AdvancedSearch({ onSearch, initialFilters }: AdvancedSearchProps) {
  const [searchText, setSearchText] = useState('');
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState<number>(1);
  const [propertyType, setPropertyType] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [instantBooking, setInstantBooking] = useState(false);
  const [superhost, setSuperhost] = useState(false);
  const [flexibleCancellation, setFlexibleCancellation] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleSearch = () => {
    const filters: PropertyFilters & { searchText?: string; checkIn?: Date; checkOut?: Date; guests?: number } = {
      location: searchText || undefined,
      priceRange: {
        min: priceRange[0],
        max: priceRange[1],
      },
      ...(propertyType && { propertyType }),
      ...(minRating > 0 && { minRating }),
      ...(selectedAmenities.length > 0 && { amenities: selectedAmenities }),
      searchText: searchText || undefined,
      checkIn,
      checkOut,
      guests,
    };

    onSearch(filters);
  };

  const handleClear = () => {
    setSearchText('');
    setCheckIn(undefined);
    setCheckOut(undefined);
    setGuests(1);
    setPropertyType('');
    setPriceRange([0, 1000]);
    setMinRating(0);
    setInstantBooking(false);
    setSuperhost(false);
    setFlexibleCancellation(false);
    setSelectedAmenities([]);
    onSearch({});
  };

  /**
   * Maneja el toggle de amenities
   */
  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h3 className="text-xl font-bold text-airbnb-text-100 mb-4">
        Búsqueda Avanzada
      </h3>

      {/* Search Text */}
      <div>
        <Label htmlFor="search-text" className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4" />
          Ubicación
        </Label>
        <Input
          id="search-text"
          placeholder="¿A dónde viajas?"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" />
            Check-in
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {checkIn ? format(checkIn, 'PPP') : 'Seleccionar fecha'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" />
            Check-out
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {checkOut ? format(checkOut, 'PPP') : 'Seleccionar fecha'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => 
                  checkIn ? date <= checkIn : date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Guests */}
      <div>
        <Label htmlFor="guests" className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4" />
          Huéspedes
        </Label>
        <Input
          id="guests"
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
          className="w-full"
        />
      </div>

      {/* Property Type */}
      <div>
        <Label>Tipo de Propiedad</Label>
        <Select 
          value={propertyType || 'all'} 
          onValueChange={(value) => setPropertyType(value === 'all' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Cualquier tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Cualquier tipo</SelectItem>
            {propertyTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <Label>
          Rango de Precio: €{priceRange[0]} - €{priceRange[1]}
        </Label>
        <div className="flex gap-4 mt-2">
          <Input
            type="number"
            min="0"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
            }
            className="w-full"
          />
          <Input
            type="number"
            min="0"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])
            }
            className="w-full"
          />
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <Label>Calificación Mínima</Label>
        <Select
          value={minRating.toString()}
          onValueChange={(value) => setMinRating(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Cualquier calificación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Cualquier calificación</SelectItem>
            <SelectItem value="4">4+ estrellas</SelectItem>
            <SelectItem value="4.5">4.5+ estrellas</SelectItem>
            <SelectItem value="5">5 estrellas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Filters */}
      <div className="space-y-3 pt-2 border-t border-airbnb-bg-300">
        <h4 className="font-semibold text-airbnb-text-100">Filtros adicionales</h4>
        
        {/* Instant Booking */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="instant-booking"
            checked={instantBooking}
            onCheckedChange={(checked) => setInstantBooking(checked === true)}
          />
          <Label htmlFor="instant-booking" className="flex items-center gap-2 cursor-pointer">
            <CheckCircle className="w-4 h-4" />
            Reserva instantánea
          </Label>
        </div>

        {/* Superhost */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="superhost"
            checked={superhost}
            onCheckedChange={(checked) => setSuperhost(checked === true)}
          />
          <Label htmlFor="superhost" className="flex items-center gap-2 cursor-pointer">
            <CheckCircle className="w-4 h-4" />
            Superhost
          </Label>
        </div>

        {/* Flexible Cancellation */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="flexible-cancellation"
            checked={flexibleCancellation}
            onCheckedChange={(checked) => setFlexibleCancellation(checked === true)}
          />
          <Label htmlFor="flexible-cancellation" className="flex items-center gap-2 cursor-pointer">
            <CheckCircle className="w-4 h-4" />
            Cancelación flexible
          </Label>
        </div>
      </div>

      {/* Popular Amenities */}
      <div className="space-y-3 pt-2 border-t border-airbnb-bg-300">
        <h4 className="font-semibold text-airbnb-text-100">Amenities populares</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="amenity-wifi"
              checked={selectedAmenities.includes('wifi')}
              onCheckedChange={() => handleAmenityToggle('wifi')}
            />
            <Label htmlFor="amenity-wifi" className="flex items-center gap-2 cursor-pointer">
              <Wifi className="w-4 h-4" />
              WiFi
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="amenity-parking"
              checked={selectedAmenities.includes('parking')}
              onCheckedChange={() => handleAmenityToggle('parking')}
            />
            <Label htmlFor="amenity-parking" className="flex items-center gap-2 cursor-pointer">
              <Car className="w-4 h-4" />
              Parking
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="amenity-pool"
              checked={selectedAmenities.includes('pool')}
              onCheckedChange={() => handleAmenityToggle('pool')}
            />
            <Label htmlFor="amenity-pool" className="flex items-center gap-2 cursor-pointer">
              <Waves className="w-4 h-4" />
              Piscina
            </Label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          onClick={handleClear}
          className="flex-1"
        >
          <X className="w-4 h-4 mr-2" />
          Limpiar
        </Button>
        <Button
          onClick={handleSearch}
          className="flex-1 bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white"
        >
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>
      </div>
    </div>
  );
}

