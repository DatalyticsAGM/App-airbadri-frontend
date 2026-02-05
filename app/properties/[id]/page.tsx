/**
 * Property Detail Page
 * 
 * Página de detalle de una propiedad
 * Server Component que exporta generateStaticParams
 */

import { PropertyDetailPageClient } from './property-detail-client';
import { getPropertyService } from '@/lib/api/service-factory';

/**
 * Genera los parámetros estáticos para la página dinámica
 * Necesario cuando se usa output: 'export' en next.config.js
 * 
 * Retorna los IDs de las propiedades de ejemplo para pre-generarlas durante el build
 */
export async function generateStaticParams() {
  // En modo export estático, Next necesita saber qué IDs pre-generar.
  // Usamos la API real para obtener la lista de propiedades.
  try {
    const properties = await getPropertyService().getAllProperties();
    return properties.map((p) => ({ id: p.id }));
  } catch {
    // Si la API no está disponible en build-time, no generamos rutas.
    return [];
  }
}

/**
 * Página de detalle de propiedad (Server Component)
 * El componente cliente está separado para permitir generateStaticParams
 */
export default function PropertyDetailPage() {
  return <PropertyDetailPageClient />;
}
