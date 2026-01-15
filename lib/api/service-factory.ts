/**
 * Service Factory
 * 
 * Factory para crear instancias de servicios (MOCK o API real)
 * basado en variables de entorno.
 */

import type {
  IAuthService,
  IPropertyService,
  IBookingService,
  IReviewService,
  INotificationService,
} from './interfaces';

// Importar servicios MOCK
import { mockAuth } from '../auth/mock-auth';
import { mockProperties } from '../properties/mock-properties';
import { mockBookings } from '../bookings/mock-bookings';
import { mockReviews } from '../reviews/mock-reviews';
import { mockNotifications } from '../notifications/mock-notifications';

// TODO: Importar servicios de API real cuando estén implementados
// import { authService } from './services/auth-service';
// import { propertyService } from './services/property-service';
// import { bookingService } from './services/booking-service';
// import { reviewService } from './services/review-service';
// import { notificationService } from './services/notification-service';

/**
 * Determina si se debe usar MOCK o API real
 */
function useMockServices(): boolean {
  // Por defecto usar MOCK si no hay URL de API configurada
  if (typeof window === 'undefined') {
    return true; // Server-side siempre usa MOCK por ahora
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_SERVICES;

  // Si está explícitamente configurado para usar MOCK
  if (useMock === 'true') {
    return true;
  }

  // Si no hay URL de API, usar MOCK
  if (!apiUrl || apiUrl === '') {
    return true;
  }

  // Si hay URL de API y no está forzado a usar MOCK, usar API real
  return false;
}

/**
 * Factory para obtener servicio de autenticación
 */
export function getAuthService(): IAuthService {
  if (useMockServices()) {
    // Adaptador para convertir la firma de mockAuth a IAuthService
    return {
      signup: async (data) => mockAuth.signup(data.email, data.password, data.fullName),
      login: mockAuth.login,
      logout: mockAuth.logout,
      getCurrentUser: mockAuth.getCurrentUser,
      isAuthenticated: mockAuth.isAuthenticated,
      forgotPassword: mockAuth.forgotPassword,
      resetPassword: mockAuth.resetPassword,
    };
  }
  // TODO: return authService;
  return {
    signup: async (data) => mockAuth.signup(data.email, data.password, data.fullName),
    login: mockAuth.login,
    logout: mockAuth.logout,
    getCurrentUser: mockAuth.getCurrentUser,
    isAuthenticated: mockAuth.isAuthenticated,
    forgotPassword: mockAuth.forgotPassword,
    resetPassword: mockAuth.resetPassword,
  };
}

/**
 * Factory para obtener servicio de propiedades
 */
export function getPropertyService(): IPropertyService {
  if (useMockServices()) {
    return mockProperties;
  }
  // TODO: return propertyService;
  return mockProperties; // Por ahora siempre MOCK
}

/**
 * Factory para obtener servicio de reservas
 */
export function getBookingService(): IBookingService {
  if (useMockServices()) {
    return mockBookings;
  }
  // TODO: return bookingService;
  return mockBookings; // Por ahora siempre MOCK
}

/**
 * Factory para obtener servicio de reviews
 */
export function getReviewService(): IReviewService {
  if (useMockServices()) {
    // Adaptador para convertir la firma de mockReviews a IReviewService
    return {
      getReviewsByProperty: mockReviews.getReviewsByProperty,
      createReview: mockReviews.createReview,
      updateReview: async (id: string, data) => {
        // Necesitamos obtener el userId de la sesión actual
        // Por ahora, retornamos null si no hay userId disponible
        // En un caso real, esto se manejaría mejor
        const { mockAuth } = await import('../auth/mock-auth');
        const user = await mockAuth.getCurrentUser();
        if (!user) {
          throw new Error('Usuario no autenticado');
        }
        return mockReviews.updateReview(id, data as any, user.id);
      },
      deleteReview: async (id: string) => {
        const { mockAuth } = await import('../auth/mock-auth');
        const user = await mockAuth.getCurrentUser();
        if (!user) {
          return false;
        }
        await mockReviews.deleteReview(id, user.id);
        return true;
      },
      calculateAverageRating: async (propertyId: string) => {
        const result = await mockReviews.calculateAverageRating(propertyId);
        return result.average;
      },
    };
  }
  // TODO: return reviewService;
  return {
    getReviewsByProperty: mockReviews.getReviewsByProperty,
    createReview: mockReviews.createReview,
    updateReview: async (id: string, data) => {
      const { mockAuth } = await import('../auth/mock-auth');
      const user = await mockAuth.getCurrentUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }
      return mockReviews.updateReview(id, data as any, user.id);
    },
    deleteReview: async (id: string) => {
      const { mockAuth } = await import('../auth/mock-auth');
      const user = await mockAuth.getCurrentUser();
      if (!user) {
        return false;
      }
      await mockReviews.deleteReview(id, user.id);
      return true;
    },
    calculateAverageRating: async (propertyId: string) => {
      const result = await mockReviews.calculateAverageRating(propertyId);
      return result.average;
    },
  };
}

/**
 * Factory para obtener servicio de notificaciones
 */
export function getNotificationService(): INotificationService {
  if (useMockServices()) {
    // Adaptador para convertir la firma de mockNotifications a INotificationService
    return {
      getNotificationsByUser: mockNotifications.getNotificationsByUser,
      createNotification: mockNotifications.createNotification,
      markAsRead: async (id: string) => {
        const { mockAuth } = await import('../auth/mock-auth');
        const user = await mockAuth.getCurrentUser();
        if (!user) {
          return false;
        }
        await mockNotifications.markAsRead(id, user.id);
        return true;
      },
      markAllAsRead: async (userId: string) => {
        await mockNotifications.markAllAsRead(userId);
        return true;
      },
      getUnreadCount: mockNotifications.getUnreadCount,
    };
  }
  // TODO: return notificationService;
  return {
    getNotificationsByUser: mockNotifications.getNotificationsByUser,
    createNotification: mockNotifications.createNotification,
    markAsRead: async (id: string) => {
      const { mockAuth } = await import('../auth/mock-auth');
      const user = await mockAuth.getCurrentUser();
      if (!user) {
        return false;
      }
      await mockNotifications.markAsRead(id, user.id);
      return true;
    },
    markAllAsRead: async (userId: string) => {
      await mockNotifications.markAllAsRead(userId);
      return true;
    },
    getUnreadCount: mockNotifications.getUnreadCount,
  };
}

