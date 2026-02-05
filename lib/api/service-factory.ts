/**
 * Service Factory
 * 
 * Factory para crear instancias de servicios (API real).
 *
 * Por qué existe: centraliza los servicios para que la UI consuma una sola puerta
 * de entrada por módulo, sin depender de implementaciones locales.
 */

import type {
  IAuthService,
  IPropertyService,
  IBookingService,
  IReviewService,
  INotificationService,
} from './interfaces';

// Servicios de API real
import { authService } from './services/auth-service';
import { propertyService } from './services/property-service';
import { bookingService } from './services/booking-service';
import { reviewService } from './services/review-service';
import { notificationService } from './services/notification-service';

/**
 * Factory para obtener servicio de autenticación
 */
export function getAuthService(): IAuthService {
  return authService;
}

/**
 * Factory para obtener servicio de propiedades
 */
export function getPropertyService(): IPropertyService {
  return propertyService;
}

/**
 * Factory para obtener servicio de reservas
 */
export function getBookingService(): IBookingService {
  return bookingService;
}

/**
 * Factory para obtener servicio de reviews
 */
export function getReviewService(): IReviewService {
  return reviewService;
}

/**
 * Factory para obtener servicio de notificaciones
 */
export function getNotificationService(): INotificationService {
  return notificationService;
}

