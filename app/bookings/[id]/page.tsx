/**
 * Booking Detail Page
 * 
 * Página de detalle de una reserva
 * Server Component que exporta generateStaticParams
 */

import { BookingDetailPageClient } from './booking-detail-client';
import { apiClient } from '@/lib/api/client';
import type { Booking } from '@/lib/bookings/types';

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
  // En export estático, Next necesita conocer los IDs en build-time.
  // Intentamos obtenerlos desde la API real. Si no hay acceso (p.ej. requiere auth),
  // devolvemos un arreglo vacío y la app puede usar la ruta estática `/bookings/detail?id=...`.
  try {
    const bookings = await apiClient.get<Booking[]>('/bookings');
    return bookings.map((b) => ({ id: b.id }));
  } catch {
    return [];
  }
}

/**
 * Página de detalle de reserva (Server Component)
 * El componente cliente está separado para permitir generateStaticParams
 */
export default function BookingDetailPage() {
  return <BookingDetailPageClient />;
}

