/**
 * Mock Bookings Service
 * 
 * Servicio MOCK para gestión de reservas que almacena datos en localStorage.
 * NO requiere backend ni base de datos real.
 * 
 * Almacenamiento:
 * - Reservas: localStorage key 'airbnb_mock_bookings'
 */

import type { Booking, CreateBookingData, BookingStatus, BookingAvailability } from './types';
import { mockProperties } from '../properties/mock-properties';

// Constante para key de localStorage
const MOCK_BOOKINGS_KEY = 'airbnb_mock_bookings';

// Simulación de delay de red
const NETWORK_DELAY = 300;

/**
 * Simula un delay de red
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtiene todas las reservas del localStorage
 */
function getBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(MOCK_BOOKINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda reservas en localStorage
 */
function saveBookings(bookings: Booking[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error('Error guardando reservas:', error);
  }
}

/**
 * Genera un ID único para una reserva
 */
function generateBookingId(): string {
  return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calcula el número de noches entre dos fechas
 */
function calculateNights(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Verifica si dos rangos de fechas se solapan
 */
function datesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const start1Date = new Date(start1);
  const end1Date = new Date(end1);
  const start2Date = new Date(start2);
  const end2Date = new Date(end2);

  return start1Date < end2Date && start2Date < end1Date;
}

/**
 * Servicio MOCK de reservas
 */
export const mockBookings = {
  /**
   * Crea una nueva reserva
   */
  async createBooking(data: CreateBookingData, userId: string): Promise<Booking> {
    await delay(NETWORK_DELAY);

    // Verificar que la propiedad existe
    const property = await mockProperties.getPropertyById(data.propertyId);
    if (!property) {
      throw new Error('Propiedad no encontrada');
    }

    // Verificar disponibilidad
    const availability = await this.checkAvailability(
      data.propertyId,
      data.checkIn,
      data.checkOut
    );

    if (!availability.available) {
      throw new Error('La propiedad no está disponible en esas fechas');
    }

    // Verificar capacidad
    if (data.guests > property.maxGuests) {
      throw new Error(`La propiedad solo acepta hasta ${property.maxGuests} huéspedes`);
    }

    // Calcular precio total
    const nights = calculateNights(data.checkIn, data.checkOut);
    const totalPrice = property.pricePerNight * nights;

    const now = new Date().toISOString();
    const newBooking: Booking = {
      id: generateBookingId(),
      ...data,
      userId,
      totalPrice,
      status: 'confirmed',
      createdAt: now,
      updatedAt: now,
    };

    const bookings = getBookings();
    bookings.push(newBooking);
    saveBookings(bookings);

    return newBooking;
  },

  /**
   * Obtiene una reserva por ID
   */
  async getBookingById(id: string): Promise<Booking | null> {
    await delay(NETWORK_DELAY);
    const bookings = getBookings();
    return bookings.find(b => b.id === id) || null;
  },

  /**
   * Obtiene todas las reservas de un usuario
   */
  async getBookingsByUser(userId: string): Promise<Booking[]> {
    await delay(NETWORK_DELAY);
    const bookings = getBookings();
    return bookings.filter(b => b.userId === userId);
  },

  /**
   * Obtiene todas las reservas de una propiedad
   */
  async getBookingsByProperty(propertyId: string): Promise<Booking[]> {
    await delay(NETWORK_DELAY);
    const bookings = getBookings();
    return bookings.filter(b => b.propertyId === propertyId);
  },

  /**
   * Actualiza el estado de una reserva
   */
  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    await delay(NETWORK_DELAY);

    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);

    if (index === -1) {
      return null;
    }

    bookings[index] = {
      ...bookings[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    saveBookings(bookings);
    return bookings[index];
  },

  /**
   * Cancela una reserva
   */
  async cancelBooking(id: string): Promise<boolean> {
    await delay(NETWORK_DELAY);

    const booking = await this.getBookingById(id);
    if (!booking) {
      return false;
    }

    // Solo se pueden cancelar reservas confirmadas o pendientes
    if (booking.status !== 'confirmed' && booking.status !== 'pending') {
      throw new Error('No se puede cancelar esta reserva');
    }

    await this.updateBookingStatus(id, 'cancelled');
    return true;
  },

  /**
   * Verifica la disponibilidad de una propiedad en un rango de fechas
   */
  async checkAvailability(
    propertyId: string,
    checkIn: string,
    checkOut: string
  ): Promise<BookingAvailability> {
    await delay(100);

    const bookings = await this.getBookingsByProperty(propertyId);
    const conflictingBookings = bookings.filter(
      booking =>
        (booking.status === 'confirmed' || booking.status === 'pending') &&
        datesOverlap(booking.checkIn, booking.checkOut, checkIn, checkOut)
    );

    return {
      available: conflictingBookings.length === 0,
      conflictingBookings: conflictingBookings.length > 0 ? conflictingBookings : undefined,
    };
  },
};

