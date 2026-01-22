/**
 * Property Summary Component
 * 
 * Componente que muestra un resumen de la propiedad en el checkout.
 * Muestra la imagen, título, ubicación, fechas, huéspedes y número de noches.
 */

'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin, Calendar, Users } from 'lucide-react';
import type { Property } from '@/lib/properties/types';

interface PropertySummaryProps {
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
}

export function PropertySummary({
  property,
  checkIn,
  checkOut,
  guests,
  nights,
}: PropertySummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-airbnb-bg-300/30">
      <div className="mb-4">
        <img
          src={property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
          alt={property.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>
      
      <h3 className="text-xl font-bold text-airbnb-text-100 mb-2">
        {property.title}
      </h3>
      
      <div className="flex items-center gap-2 text-airbnb-text-200 mb-4">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">
          {property.location.city}, {property.location.country}
        </span>
      </div>
      
      <div className="space-y-3 pt-4 border-t border-airbnb-bg-300">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-airbnb-primary-100" />
          <div className="flex-1">
            <p className="text-sm text-airbnb-text-200">Check-in</p>
            <p className="font-semibold text-airbnb-text-100">
              {format(new Date(checkIn), 'PPP', { locale: es })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-airbnb-primary-100" />
          <div className="flex-1">
            <p className="text-sm text-airbnb-text-200">Check-out</p>
            <p className="font-semibold text-airbnb-text-100">
              {format(new Date(checkOut), 'PPP', { locale: es })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-airbnb-primary-100" />
          <div className="flex-1">
            <p className="text-sm text-airbnb-text-200">Huéspedes</p>
            <p className="font-semibold text-airbnb-text-100">{guests}</p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-airbnb-bg-300">
          <p className="text-sm text-airbnb-text-200">Noches</p>
          <p className="font-semibold text-airbnb-text-100">
            {nights} {nights === 1 ? 'noche' : 'noches'}
          </p>
        </div>
      </div>
    </div>
  );
}

