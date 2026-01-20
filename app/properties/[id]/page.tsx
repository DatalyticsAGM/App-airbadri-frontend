/**
 * Property Detail Page
 * 
 * Página de detalle de una propiedad
 * Server Component que exporta generateStaticParams
 */

import { PropertyDetailPageClient } from './property-detail-client';
import { mockPropertiesData } from '@/lib/properties/mock-data';

/**
 * Genera los parámetros estáticos para la página dinámica
 * Necesario cuando se usa output: 'export' en next.config.js
 * 
 * Retorna los IDs de las propiedades de ejemplo para pre-generarlas durante el build
 */
export async function generateStaticParams() {
  // Generar IDs basados en las propiedades de ejemplo
  // Estas son las propiedades que se inicializan por defecto en el sistema
  return mockPropertiesData.map((_, index) => ({
    id: `prop_example_${index + 1}`,
  }));
}

/**
 * Página de detalle de propiedad (Server Component)
 * El componente cliente está separado para permitir generateStaticParams
 */
export default function PropertyDetailPage() {
  return <PropertyDetailPageClient />;
}
