/**
 * Booking Service (API Real)
 * 
 * Implementación del servicio de reservas usando API real.
 * TODO: Implementar cuando el backend esté listo.
 */

import { apiClient } from '../client';
import type { IBookingService } from '../interfaces';
import type { Booking, CreateBookingData, BookingStatus } from '../../bookings/types';

/**
 * Servicio de reservas usando API real
 */
export const bookingService: IBookingService = {
  async createBooking(data, userId) {
    return apiClient.post<Booking>('/bookings', {
      ...data,
      userId,
    });
  },

  async getBookingById(id) {
    return apiClient.get<Booking>(`/bookings/${id}`);
  },

  async getBookingsByUser(userId) {
    return apiClient.get<Booking[]>(`/bookings?userId=${userId}`);
  },

  async getBookingsByProperty(propertyId) {
    return apiClient.get<Booking[]>(`/bookings?propertyId=${propertyId}`);
  },

  async updateBookingStatus(id, status) {
    return apiClient.patch<Booking>(`/bookings/${id}`, { status });
  },

  async cancelBooking(id) {
    await apiClient.post(`/bookings/${id}/cancel`);
    return true;
  },

  async checkAvailability(propertyId, checkIn, checkOut) {
    return apiClient.get<{ available: boolean; conflictingBookings?: Booking[] }>(
      `/bookings/availability?propertyId=${propertyId}&checkIn=${checkIn}&checkOut=${checkOut}`
    );
  },
};



