/**
 * Review Card Component
 * 
 * Componente para mostrar una review individual
 */

'use client';

import { Star, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Review } from '@/lib/reviews/types';
import { mockReviews } from '@/lib/reviews/mock-reviews';
import { useState } from 'react';

interface ReviewCardProps {
  review: Review;
  showHelpful?: boolean;
}

export function ReviewCard({ review, showHelpful = true }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);

  const handleMarkHelpful = async () => {
    if (hasMarkedHelpful) return;
    
    try {
      await mockReviews.markAsHelpful(review.id);
      setHelpfulCount(prev => prev + 1);
      setHasMarkedHelpful(true);
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 30) return `Hace ${diffDays} días`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  };

  return (
    <div className="border-b border-airbnb-bg-300/30 pb-6 mb-6 last:border-b-0 last:mb-0">
      <div className="flex gap-4">
        {/* Avatar */}
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage src={review.userAvatar} alt={review.userName} />
          <AvatarFallback>
            {review.userName
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-airbnb-text-100">
                  {review.userName}
                </h4>
                {review.verified && (
                  <span className="text-xs bg-airbnb-accent-100 text-white px-2 py-0.5 rounded-full">
                    Verificado
                  </span>
                )}
              </div>
              <p className="text-sm text-airbnb-text-200">
                {formatDate(review.date)}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating.overall
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          <p className="text-airbnb-text-200 leading-relaxed mb-3">
            {review.comment}
          </p>

          {/* Detailed Ratings (if available) */}
          {(review.rating.cleanliness ||
            review.rating.accuracy ||
            review.rating.communication ||
            review.rating.location ||
            review.rating.checkin ||
            review.rating.value) && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-airbnb-text-200 mb-3">
              {review.rating.cleanliness && (
                <div>
                  <span className="font-medium">Limpieza:</span>{' '}
                  {review.rating.cleanliness}/5
                </div>
              )}
              {review.rating.accuracy && (
                <div>
                  <span className="font-medium">Precisión:</span>{' '}
                  {review.rating.accuracy}/5
                </div>
              )}
              {review.rating.communication && (
                <div>
                  <span className="font-medium">Comunicación:</span>{' '}
                  {review.rating.communication}/5
                </div>
              )}
              {review.rating.location && (
                <div>
                  <span className="font-medium">Ubicación:</span>{' '}
                  {review.rating.location}/5
                </div>
              )}
              {review.rating.checkin && (
                <div>
                  <span className="font-medium">Check-in:</span>{' '}
                  {review.rating.checkin}/5
                </div>
              )}
              {review.rating.value && (
                <div>
                  <span className="font-medium">Precio-calidad:</span>{' '}
                  {review.rating.value}/5
                </div>
              )}
            </div>
          )}

          {/* Helpful Button */}
          {showHelpful && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkHelpful}
              disabled={hasMarkedHelpful}
              className="text-sm text-airbnb-text-200 hover:text-airbnb-primary-100 h-auto p-0"
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              Útil ({helpfulCount})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}



