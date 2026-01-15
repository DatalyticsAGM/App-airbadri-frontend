/**
 * Mock Reviews Service
 * 
 * Servicio MOCK para gestión de reviews y ratings
 * Almacena datos en localStorage
 */

import type { Review, CreateReviewData, UpdateReviewData, ReviewFilters, RatingValue } from './types';

const STORAGE_KEY = 'airbnb_reviews';

/**
 * Obtener todas las reviews del localStorage
 */
function getStoredReviews(): Review[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading reviews from localStorage:', error);
    return [];
  }
}

/**
 * Guardar reviews en localStorage
 */
function saveReviews(reviews: Review[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (error) {
    console.error('Error saving reviews to localStorage:', error);
  }
}

/**
 * Generar ID único para review
 */
function generateReviewId(): string {
  return `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const mockReviews = {
  /**
   * Obtener todas las reviews de una propiedad
   */
  async getReviewsByProperty(propertyId: string, filters?: ReviewFilters): Promise<Review[]> {
    const reviews = getStoredReviews();
    let filtered = reviews.filter(review => review.propertyId === propertyId);

    // Aplicar filtros
    if (filters) {
      if (filters.minRating) {
        filtered = filtered.filter(review => review.rating.overall >= filters.minRating!);
      }

      // Ordenar
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            break;
          case 'oldest':
            filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            break;
          case 'highest':
            filtered.sort((a, b) => b.rating.overall - a.rating.overall);
            break;
          case 'lowest':
            filtered.sort((a, b) => a.rating.overall - b.rating.overall);
            break;
          case 'most_helpful':
            filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
            break;
        }
      }
    }

    return filtered;
  },

  /**
   * Obtener una review por ID
   */
  async getReviewById(id: string): Promise<Review | null> {
    const reviews = getStoredReviews();
    return reviews.find(review => review.id === id) || null;
  },

  /**
   * Obtener reviews de un usuario
   */
  async getReviewsByUser(userId: string): Promise<Review[]> {
    const reviews = getStoredReviews();
    return reviews.filter(review => review.userId === userId);
  },

  /**
   * Crear una nueva review
   */
  async createReview(data: CreateReviewData): Promise<Review> {
    const reviews = getStoredReviews();
    
    // Verificar si el usuario ya tiene una review para esta propiedad
    const existingReview = reviews.find(
      r => r.propertyId === data.propertyId && r.userId === data.userId
    );
    
    if (existingReview) {
      throw new Error('Ya has escrito una review para esta propiedad');
    }

    // Obtener información del usuario (mock)
    const { mockAuth } = await import('../auth/mock-auth');
    const user = await mockAuth.getCurrentUser();
    
    const newReview: Review = {
      id: generateReviewId(),
      propertyId: data.propertyId,
      userId: data.userId,
      userName: user?.fullName || 'Usuario',
      userAvatar: user?.avatar,
      rating: data.rating,
      comment: data.comment,
      date: new Date().toISOString(),
      helpful: 0,
      verified: true, // En producción, verificar si tiene booking completado
    };

    reviews.push(newReview);
    saveReviews(reviews);

    return newReview;
  },

  /**
   * Actualizar una review
   */
  async updateReview(id: string, data: UpdateReviewData, userId: string): Promise<Review> {
    const reviews = getStoredReviews();
    const index = reviews.findIndex(review => review.id === id);

    if (index === -1) {
      throw new Error('Review no encontrada');
    }

    if (reviews[index].userId !== userId) {
      throw new Error('No tienes permiso para editar esta review');
    }

    reviews[index] = {
      ...reviews[index],
      ...(data.rating && { rating: data.rating }),
      ...(data.comment && { comment: data.comment }),
    };

    saveReviews(reviews);
    return reviews[index];
  },

  /**
   * Eliminar una review
   */
  async deleteReview(id: string, userId: string): Promise<void> {
    const reviews = getStoredReviews();
    const review = reviews.find(r => r.id === id);

    if (!review) {
      throw new Error('Review no encontrada');
    }

    if (review.userId !== userId) {
      throw new Error('No tienes permiso para eliminar esta review');
    }

    const filtered = reviews.filter(r => r.id !== id);
    saveReviews(filtered);
  },

  /**
   * Calcular rating promedio de una propiedad
   */
  async calculateAverageRating(propertyId: string): Promise<{ average: number; count: number }> {
    const reviews = await this.getReviewsByProperty(propertyId);
    
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating.overall, 0);
    const average = sum / reviews.length;

    return {
      average: Math.round(average * 10) / 10, // Redondear a 1 decimal
      count: reviews.length,
    };
  },

  /**
   * Marcar review como útil
   */
  async markAsHelpful(id: string): Promise<void> {
    const reviews = getStoredReviews();
    const review = reviews.find(r => r.id === id);

    if (review) {
      review.helpful = (review.helpful || 0) + 1;
      saveReviews(reviews);
    }
  },
};

