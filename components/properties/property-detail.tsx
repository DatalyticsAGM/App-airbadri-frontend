/**
 * Property Detail Component
 * 
 * Componente para mostrar los detalles completos de una propiedad
 */

'use client';

import { Star, MapPin, Users, Bed, Bath, Wifi, Car, Waves, Home } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { Property } from '@/lib/properties/types';

interface PropertyDetailProps {
  property: Property;
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  WiFi: Wifi,
  Parking: Car,
  Piscina: Waves,
  'Cocina equipada': Home,
};

export function PropertyDetail({ property }: PropertyDetailProps) {
  return (
    <div className="space-y-8">
      {/* Image Gallery */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {property.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[500px] rounded-2xl overflow-hidden">
                  <img
                    src={image}
                    alt={`${property.title} - Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {property.images.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>

      {/* Title and Location */}
      <div>
        <h1 className="text-3xl font-bold text-airbnb-text-100 mb-3">
          {property.title}
        </h1>
        <div className="flex items-center gap-2 text-airbnb-text-200 mb-4">
          <MapPin className="w-5 h-5" />
          <span>
            {property.location.address}, {property.location.city}, {property.location.country}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-airbnb-text-100">
              {property.rating.toFixed(1)}
            </span>
            <span className="text-airbnb-text-200">
              ({property.reviewCount} reseñas)
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-airbnb-bg-300"></div>

      {/* Property Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-airbnb-primary-100" />
          <div>
            <div className="text-sm text-airbnb-text-200">Huéspedes</div>
            <div className="font-semibold text-airbnb-text-100">{property.maxGuests}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Bed className="w-6 h-6 text-airbnb-primary-100" />
          <div>
            <div className="text-sm text-airbnb-text-200">Habitaciones</div>
            <div className="font-semibold text-airbnb-text-100">{property.bedrooms}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Bath className="w-6 h-6 text-airbnb-primary-100" />
          <div>
            <div className="text-sm text-airbnb-text-200">Baños</div>
            <div className="font-semibold text-airbnb-text-100">{property.bathrooms}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Home className="w-6 h-6 text-airbnb-primary-100" />
          <div>
            <div className="text-sm text-airbnb-text-200">Precio/noche</div>
            <div className="font-semibold text-airbnb-text-100">€{property.pricePerNight}</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-airbnb-bg-300"></div>

      {/* Description */}
      <div>
        <h2 className="text-2xl font-bold text-airbnb-text-100 mb-4">Acerca de este lugar</h2>
        <p className="text-airbnb-text-200 leading-relaxed whitespace-pre-line">
          {property.description}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-airbnb-bg-300"></div>

      {/* Amenities */}
      <div>
        <h2 className="text-2xl font-bold text-airbnb-text-100 mb-4">Qué ofrece este lugar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {property.amenities.map((amenity) => {
            const Icon = amenityIcons[amenity] || Home;
            return (
              <div key={amenity} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-airbnb-primary-100" />
                <span className="text-airbnb-text-200">{amenity}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-airbnb-bg-300"></div>

      {/* Host Info */}
      <div>
        <h2 className="text-2xl font-bold text-airbnb-text-100 mb-4">Anfitrión</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-airbnb-primary-300 flex items-center justify-center">
            <span className="text-2xl font-bold text-airbnb-primary-100">
              {property.hostName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-semibold text-airbnb-text-100">{property.hostName}</div>
            <div className="text-sm text-airbnb-text-200">Anfitrión desde 2020</div>
          </div>
        </div>
      </div>
    </div>
  );
}

