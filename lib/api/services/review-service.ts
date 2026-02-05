/**
 * Review Service (API Real)
 *
 * Por qué existe: centraliza el acceso HTTP a reviews para que los componentes
 * no dependan de servicios locales.
 */

import { apiClient } from '../client';
import type { IReviewService } from '../interfaces';
import type { Review, CreateReviewData, UpdateReviewData } from '../../reviews/types';

export const reviewService: IReviewService = {
  async getReviewsByProperty(propertyId: string) {
    return apiClient.get<Review[]>(`/reviews?propertyId=${propertyId}`);
  },

  async createReview(data: CreateReviewData) {
    return apiClient.post<Review>('/reviews', data);
  },

  async updateReview(id: string, data: Partial<CreateReviewData> | UpdateReviewData) {
    // `IReviewService` usa Partial<CreateReviewData>, pero en reviews/types existe UpdateReviewData.
    // Aceptamos ambos para mantener el código simple y compatible.
    return apiClient.patch<Review>(`/reviews/${id}`, data);
  },

  async deleteReview(id: string) {
    await apiClient.delete(`/reviews/${id}`);
    return true;
  },

  async calculateAverageRating(propertyId: string) {
    // Implementación simple: calcula el promedio desde la lista de reviews.
    // Si el backend agrega un endpoint de promedio, se puede reemplazar aquí sin tocar UI.
    const reviews = await apiClient.get<Review[]>(`/reviews?propertyId=${propertyId}`);
    if (!reviews.length) return 0;

    const total = reviews.reduce((acc, review) => acc + (review.rating?.overall || 0), 0);
    return total / reviews.length;
  },
};

