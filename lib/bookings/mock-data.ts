/**
 * Mock Data for Bookings
 * 
 * Datos de ejemplo para inicializar el sistema con reservas
 */

import type { Booking } from './types';

/**
 * Reservas de ejemplo
 * Nota: Los IDs de propiedades y usuarios deben existir en los datos de ejemplo
 */
export const mockBookingsData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    propertyId: 'prop_example_1', // Casa en Barcelona
    userId: 'user_demo_host', // Usuario demo host
    checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // En 7 días
    checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // En 10 días
    guests: 4,
    totalPrice: 360, // 3 noches × 120€
    status: 'confirmed',
  },
  {
    propertyId: 'prop_example_2', // Apartamento en Madrid
    userId: 'user_demo_guest', // Usuario demo guest
    checkIn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Hace 5 días
    checkOut: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
    guests: 2,
    totalPrice: 255, // 3 noches × 85€
    status: 'completed',
  },
  {
    propertyId: 'prop_example_3', // Villa en Valencia
    userId: 'user_demo_guest', // Usuario demo guest
    checkIn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // En 14 días
    checkOut: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(), // En 18 días
    guests: 6,
    totalPrice: 800, // 4 noches × 200€
    status: 'confirmed',
  },
  {
    propertyId: 'prop_example_1', // Casa en Barcelona
    userId: 'user_demo_guest', // Usuario demo guest
    checkIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // En 30 días
    checkOut: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString(), // En 33 días
    guests: 2,
    totalPrice: 360, // 3 noches × 120€
    status: 'pending',
  },
  {
    propertyId: 'prop_example_5', // Casa rural en los Pirineos
    userId: 'user_demo_guest', // Usuario demo guest
    checkIn: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // Hace 20 días
    checkOut: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(), // Hace 17 días
    guests: 3,
    totalPrice: 285, // 3 noches × 95€
    status: 'completed',
  },
  {
    propertyId: 'prop_example_7', // Casa de playa en Málaga
    userId: 'user_demo_guest', // Usuario demo guest
    checkIn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Hace 10 días
    checkOut: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Hace 7 días
    guests: 4,
    totalPrice: 450, // 3 noches × 150€
    status: 'cancelled',
  },
];

/**
 * Inicializa reservas de ejemplo en localStorage si no existen
 */
export function initializeMockBookings(): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = localStorage.getItem('airbnb_mock_bookings');
    if (existing) {
      // Ya hay reservas, no inicializar
      return;
    }

    // Crear reservas con IDs y fechas
    const now = new Date().toISOString();
    const bookings = mockBookingsData.map((booking, index) => ({
      ...booking,
      id: `booking_example_${index + 1}`,
      createdAt: now,
      updatedAt: now,
    }));

    localStorage.setItem('airbnb_mock_bookings', JSON.stringify(bookings));
    console.log('✅ Reservas de ejemplo inicializadas correctamente');
  } catch (error) {
    console.error('Error inicializando reservas de ejemplo:', error);
  }
}

