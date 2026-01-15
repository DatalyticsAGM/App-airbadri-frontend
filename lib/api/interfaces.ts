/**
 * Service Interfaces
 * 
 * Interfaces que definen los contratos para todos los servicios.
 * Permiten cambiar fácilmente entre implementaciones MOCK y API real.
 */

import type { User, AuthResponse, ResetPasswordResponse } from '../auth/mock-auth';
import type { Property, CreatePropertyData, PropertyFilters } from '../properties/types';
import type { Booking, CreateBookingData, BookingStatus } from '../bookings/types';
import type { Review, CreateReviewData } from '../reviews/types';
import type { Notification } from '../notifications/types';

/**
 * Interface para servicio de autenticación
 */
export interface IAuthService {
  signup(data: { email: string; password: string; fullName: string }): Promise<AuthResponse>;
  login(email: string, password: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  isAuthenticated(): boolean;
  forgotPassword(email: string): Promise<ResetPasswordResponse>;
  resetPassword(token: string, password: string): Promise<ResetPasswordResponse>;
}

/**
 * Interface para servicio de propiedades
 */
export interface IPropertyService {
  getAllProperties(): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | null>;
  getPropertiesByHost(hostId: string): Promise<Property[]>;
  createProperty(data: CreatePropertyData, hostId: string, hostName: string): Promise<Property>;
  updateProperty(id: string, data: Partial<CreatePropertyData>): Promise<Property | null>;
  deleteProperty(id: string): Promise<boolean>;
  searchProperties(filters: PropertyFilters): Promise<Property[]>;
}

/**
 * Interface para servicio de reservas
 */
export interface IBookingService {
  createBooking(data: CreateBookingData, userId: string): Promise<Booking>;
  getBookingById(id: string): Promise<Booking | null>;
  getBookingsByUser(userId: string): Promise<Booking[]>;
  getBookingsByProperty(propertyId: string): Promise<Booking[]>;
  updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null>;
  cancelBooking(id: string): Promise<boolean>;
  checkAvailability(propertyId: string, checkIn: string, checkOut: string): Promise<{ available: boolean; conflictingBookings?: Booking[] }>;
}

/**
 * Interface para servicio de reviews
 */
export interface IReviewService {
  getReviewsByProperty(propertyId: string): Promise<Review[]>;
  createReview(data: CreateReviewData): Promise<Review>;
  updateReview(id: string, data: Partial<CreateReviewData>): Promise<Review | null>;
  deleteReview(id: string): Promise<boolean>;
  calculateAverageRating(propertyId: string): Promise<number>;
}

/**
 * Interface para servicio de notificaciones
 */
export interface INotificationService {
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(data: Omit<Notification, 'id' | 'date'>): Promise<Notification>;
  markAsRead(id: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<boolean>;
  getUnreadCount(userId: string): Promise<number>;
}

