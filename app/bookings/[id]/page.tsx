/**
 * Booking Detail Page
 * 
 * Página de detalle de una reserva
 * Server Component que exporta generateStaticParams
 */

import { BookingDetailPageClient } from './booking-detail-client';
import { mockBookingsData } from '@/lib/bookings/mock-data';

/**
 * Permite que Next.js genere páginas dinámicas bajo demanda
 * Necesario cuando se usa output: 'export' y las rutas se crean dinámicamente
 */
export const dynamicParams = true;

/**
 * Genera los parámetros estáticos para la página dinámica
 * Necesario cuando se usa output: 'export' en next.config.js
 * 
 * Retorna los IDs de las reservas de ejemplo para pre-generarlas durante el build.
 * Las reservas creadas dinámicamente se generarán bajo demanda gracias a dynamicParams = true.
 */
export async function generateStaticParams() {
  // Retornar IDs de reservas de ejemplo para pre-generarlas
  // Las reservas dinámicas se generarán bajo demanda
  return mockBookingsData.map((_, index) => ({
    id: `booking_example_${index + 1}`,
  }));
}

/**
 * Página de detalle de reserva (Server Component)
 * El componente cliente está separado para permitir generateStaticParams
 */
export default function BookingDetailPage() {
  return <BookingDetailPageClient />;
}

