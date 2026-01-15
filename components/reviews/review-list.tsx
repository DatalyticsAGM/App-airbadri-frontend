/**
 * Review List Component
 * 
 * Componente para mostrar una lista de reviews con paginación y filtros
 */

'use client';

import { useState, useEffect } from 'react';
import { ReviewCard } from './review-card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Review, ReviewFilters } from '@/lib/reviews/types';
import { mockReviews } from '@/lib/reviews/mock-reviews';

interface ReviewListProps {
  propertyId: string;
  showFilters?: boolean;
  limit?: number;
}

export function ReviewList({
  propertyId,
  showFilters = true,
  limit = 10,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: 'newest',
  });
  const [displayedCount, setDisplayedCount] = useState(limit);

  useEffect(() => {
    loadReviews();
  }, [propertyId, filters]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const allReviews = await mockReviews.getReviewsByProperty(
        propertyId,
        filters
      );
      setReviews(allReviews);
      setDisplayedCount(limit);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value as ReviewFilters['sortBy'],
    }));
  };

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + limit);
  };

  const displayedReviews = reviews.slice(0, displayedCount);
  const hasMore = reviews.length > displayedCount;

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-airbnb-bg-300 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-airbnb-bg-300 rounded w-1/4" />
                <div className="h-4 bg-airbnb-bg-300 rounded w-1/2" />
                <div className="h-4 bg-airbnb-bg-300 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-airbnb-text-200">
          Aún no hay reviews para esta propiedad.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      {showFilters && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-airbnb-text-100">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </h3>
          <Select
            value={filters.sortBy || 'newest'}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="oldest">Más antiguas</SelectItem>
              <SelectItem value="highest">Mejor calificadas</SelectItem>
              <SelectItem value="lowest">Peor calificadas</SelectItem>
              <SelectItem value="most_helpful">Más útiles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Reviews */}
      <div className="space-y-6">
        {displayedReviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="border-airbnb-primary-100 text-airbnb-primary-100 hover:bg-airbnb-primary-100 hover:text-white"
          >
            Ver más reviews ({reviews.length - displayedCount} restantes)
          </Button>
        </div>
      )}
    </div>
  );
}



