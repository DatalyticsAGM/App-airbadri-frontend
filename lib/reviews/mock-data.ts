/**
 * Mock Reviews Data
 * 
 * Datos de ejemplo para reviews
 */

import type { Review } from './types';
import { mockReviews } from './mock-reviews';

const exampleReviews: Omit<Review, 'id' | 'date'>[] = [
  {
    propertyId: 'prop_1',
    userId: 'user_demo_guest',
    userName: 'María González',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    rating: {
      overall: 5,
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 4,
      checkin: 5,
      value: 5,
    },
    comment: 'Excelente experiencia! La casa es aún más bonita de lo que se ve en las fotos. El anfitrión fue muy atento y respondió rápidamente a todas nuestras preguntas. Definitivamente volvería.',
    helpful: 12,
    verified: true,
  },
  {
    propertyId: 'prop_1',
    userId: 'user_2',
    userName: 'Carlos Rodríguez',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    rating: {
      overall: 4,
      cleanliness: 4,
      accuracy: 5,
      communication: 4,
      location: 4,
      checkin: 4,
      value: 4,
    },
    comment: 'Muy buena ubicación y la casa está bien equipada. El único detalle es que el wifi era un poco lento, pero en general todo estuvo bien.',
    helpful: 8,
    verified: true,
  },
  {
    propertyId: 'prop_2',
    userId: 'user_3',
    userName: 'Ana Martínez',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    rating: {
      overall: 5,
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkin: 5,
      value: 5,
    },
    comment: 'Increíble apartamento en el centro. Todo estaba perfecto y la vista es espectacular. El anfitrión nos dejó excelentes recomendaciones de lugares para visitar.',
    helpful: 15,
    verified: true,
  },
  {
    propertyId: 'prop_2',
    userId: 'user_4',
    userName: 'Luis Fernández',
    userAvatar: 'https://i.pravatar.cc/150?img=4',
    rating: {
      overall: 4,
      cleanliness: 4,
      accuracy: 4,
      communication: 5,
      location: 5,
      checkin: 4,
      value: 4,
    },
    comment: 'Buen lugar para una estancia corta. La ubicación es perfecta para explorar la ciudad. Algunos detalles menores pero nada que afecte la experiencia general.',
    helpful: 5,
    verified: true,
  },
];

/**
 * Inicializar reviews de ejemplo en localStorage
 */
export function initializeMockReviews(): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem('airbnb_reviews');
    if (stored) {
      // Ya hay reviews, no inicializar
      return;
    }

    const reviews: Review[] = exampleReviews.map((review, index) => ({
      ...review,
      id: `review_example_${index + 1}`,
      date: new Date(Date.now() - (index + 1) * 86400000).toISOString(), // Días atrás
    }));

    localStorage.setItem('airbnb_reviews', JSON.stringify(reviews));
  } catch (error) {
    console.error('Error initializing mock reviews:', error);
  }
}







