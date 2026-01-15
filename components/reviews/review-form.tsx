/**
 * Review Form Component
 * 
 * Formulario para crear o editar una review
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { mockReviews } from '@/lib/reviews/mock-reviews';
import type { RatingValue } from '@/lib/reviews/types';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres'),
  cleanliness: z.number().min(1).max(5).optional(),
  accuracy: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  location: z.number().min(1).max(5).optional(),
  checkin: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  propertyId: string;
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: {
    rating: number;
    comment: string;
  };
}

export function ReviewForm({
  propertyId,
  userId,
  onSuccess,
  onCancel,
  initialData,
}: ReviewFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      comment: initialData?.comment || '',
      cleanliness: undefined,
      accuracy: undefined,
      communication: undefined,
      location: undefined,
      checkin: undefined,
      value: undefined,
    },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    setIsLoading(true);
    try {
      const rating = {
        overall: values.rating as RatingValue,
        ...(values.cleanliness && { cleanliness: values.cleanliness as RatingValue }),
        ...(values.accuracy && { accuracy: values.accuracy as RatingValue }),
        ...(values.communication && { communication: values.communication as RatingValue }),
        ...(values.location && { location: values.location as RatingValue }),
        ...(values.checkin && { checkin: values.checkin as RatingValue }),
        ...(values.value && { value: values.value as RatingValue }),
      };

      await mockReviews.createReview({
        propertyId,
        userId,
        rating,
        comment: values.comment,
      });

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating review:', error);
      form.setError('root', {
        message: error.message || 'Error al crear la review',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rating = form.watch('rating');
  const displayRating = hoveredRating || rating;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Overall Rating */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calificación General *</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(null)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          value <= displayRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                  {displayRating > 0 && (
                    <span className="ml-2 text-sm text-airbnb-text-200">
                      {displayRating}/5
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Detailed Ratings (Optional) */}
        <div className="space-y-4">
          <Label className="text-sm text-airbnb-text-200">
            Calificaciones Detalladas (Opcional)
          </Label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'cleanliness', label: 'Limpieza' },
              { key: 'accuracy', label: 'Precisión' },
              { key: 'communication', label: 'Comunicación' },
              { key: 'location', label: 'Ubicación' },
              { key: 'checkin', label: 'Check-in' },
              { key: 'value', label: 'Precio-calidad' },
            ].map(({ key, label }) => (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof ReviewFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">{label}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => field.onChange(value)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                value <= (Number(field.value) || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Comment */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentario *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Comparte tu experiencia..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error Message */}
        {form.formState.errors.root && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white"
          >
            {isLoading ? 'Enviando...' : 'Publicar Review'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

