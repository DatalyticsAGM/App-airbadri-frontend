/**
 * Booking Service (API Real)
 * 
 * Implementación del servicio de reservas usando API real.
 * TODO: Implementar cuando el backend esté listo.
 */

import { apiClient } from '../client';
import type { IBookingService } from '../interfaces';
import type { Booking, CreateBookingData, BookingStatus } from '../../bookings/types';

function unwrapList(raw: any): any[] {
  const list = Array.isArray(raw) ? raw : raw?.data ?? raw?.bookings ?? raw?.items ?? raw?.results ?? [];
  return Array.isArray(list) ? list : [];
}

function unwrapItem(raw: any): any {
  return raw?.data ?? raw?.booking ?? raw?.item ?? raw;
}

function coerceString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function coerceNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function normalizeStatus(value: unknown): BookingStatus {
  const s = coerceString(value) as BookingStatus;
  if (s === 'pending' || s === 'confirmed' || s === 'cancelled' || s === 'completed') return s;
  return 'pending';
}

function normalizeBooking(raw: any): Booking {
  return {
    id: coerceString(raw?.id || raw?._id),
    propertyId: coerceString(raw?.propertyId),
    userId: coerceString(raw?.userId),
    checkIn: coerceString(raw?.checkIn) || new Date().toISOString(),
    checkOut: coerceString(raw?.checkOut) || new Date().toISOString(),
    guests: coerceNumber(raw?.guests, 1),
    totalPrice: coerceNumber(raw?.totalPrice, 0),
    status: normalizeStatus(raw?.status),
    createdAt: coerceString(raw?.createdAt) || new Date().toISOString(),
    updatedAt: coerceString(raw?.updatedAt) || new Date().toISOString(),
  };
}

/**
 * Servicio de reservas usando API real
 */
export const bookingService: IBookingService = {
  async createBooking(data, userId) {
    const raw = await apiClient.post<any>('/bookings', {
      ...data,
      userId,
    });
    return normalizeBooking(unwrapItem(raw));
  },

  async getBookingById(id) {
    const raw = await apiClient.get<any>(`/bookings/${id}`);
    return normalizeBooking(unwrapItem(raw));
  },

  async getBookingsByUser(userId) {
    const raw = await apiClient.get<any>(`/bookings?userId=${encodeURIComponent(userId)}`);
    return unwrapList(raw).map(normalizeBooking);
  },

  async getBookingsByProperty(propertyId) {
    const raw = await apiClient.get<any>(`/bookings?propertyId=${encodeURIComponent(propertyId)}`);
    return unwrapList(raw).map(normalizeBooking);
  },

  async updateBookingStatus(id, status) {
    const raw = await apiClient.patch<any>(`/bookings/${id}`, { status });
    return normalizeBooking(unwrapItem(raw));
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







