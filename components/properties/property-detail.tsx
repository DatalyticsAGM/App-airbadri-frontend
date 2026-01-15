/**
 * Property Detail Component
 * 
 * Componente para mostrar los detalles completos de una propiedad
 */

'use client';

import { useState, useEffect } from 'react';
import { Star, MapPin, Users, Bed, Bath, Wifi, Car, Waves, Home } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ReviewList } from '@/components/reviews/review-list';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReviewForm } from '@/components/reviews/review-form';
import { ShareButton } from './share-button';
import { useAuth } from '@/lib/auth/auth-context';
import { mockReviews } from '@/lib/reviews/mock-reviews';
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
  const { user, isAuthenticated } = useAuth();
  const [ratingData, setRatingData] = useState({ average: property.rating, count: property.reviewCount });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadRatingData();
  }, [property.id, refreshKey]);

  const loadRatingData = async () => {
    try {
      const data = await mockReviews.calculateAverageRating(property.id);
      setRatingData(data);
    } catch (error) {
      console.error('Error loading rating data:', error);
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setRefreshKey(prev => prev + 1);
    loadRatingData();
  };

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
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-3xl font-bold text-airbnb-text-100 flex-1">
            {property.title}
          </h1>
          <ShareButton property={property} />
        </div>
        <div className="flex items-center gap-2 text-airbnb-text-200 mb-4">
          <MapPin className="w-5 h-5" />
          <span>
            {property.location.address}, {property.location.city}, {property.location.country}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-airbnb-text-100">
              {ratingData.average > 0 ? ratingData.average.toFixed(1) : 'Nuevo'}
            </span>
            <span className="text-airbnb-text-200">
              ({ratingData.count} {ratingData.count === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShareButton property={property} />
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

      {/* Divider */}
      <div className="border-t border-airbnb-bg-300"></div>

      {/* Reviews Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-airbnb-text-100">
            Reseñas
          </h2>
          {isAuthenticated && user && (
            <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
              <DialogTrigger asChild>
                <Button className="bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white">
                  Escribir una reseña
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Escribe una reseña</DialogTitle>
                </DialogHeader>
                <ReviewForm
                  propertyId={property.id}
                  userId={user.id}
                  onSuccess={handleReviewSuccess}
                  onCancel={() => setShowReviewForm(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        <ReviewList propertyId={property.id} key={refreshKey} />
      </div>
    </div>
  );
}

