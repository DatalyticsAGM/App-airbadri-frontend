/**
 * Property Card Component
 * 
 * Componente para mostrar una tarjeta de propiedad en el catálogo
 */

'use client';

import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { FavoriteButton } from '@/components/favorites/favorite-button';
import type { Property } from '@/lib/properties/types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="relative">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-64 overflow-hidden group">
          <Link href={`/properties/${property.id}`}>
            <img
              src={property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
              alt={property.title}
              className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
            />
          </Link>
          {/* Favorite Button */}
          <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
            <FavoriteButton propertyId={property.id} size="md" variant="ghost" />
          </div>
        </div>

        {/* Content */}
        <Link href={`/properties/${property.id}`}>
          <div className="p-5 cursor-pointer">
            {/* Location */}
            <div className="flex items-center gap-1 text-airbnb-text-200 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {property.location.city}, {property.location.country}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-airbnb-text-100 mb-2 line-clamp-2">
              {property.title}
            </h3>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-airbnb-text-100">
                {property.rating.toFixed(1)}
              </span>
              <span className="text-sm text-airbnb-text-200">
                ({property.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-airbnb-text-100">
                €{property.pricePerNight}
              </span>
              <span className="text-sm text-airbnb-text-200">noche</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

