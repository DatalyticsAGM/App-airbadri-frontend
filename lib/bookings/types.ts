/**
 * Types for Bookings Module
 * 
 * Tipos TypeScript para el módulo de reservas
 */

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface BookingAvailability {
  available: boolean;
  conflictingBookings?: Booking[];
}

