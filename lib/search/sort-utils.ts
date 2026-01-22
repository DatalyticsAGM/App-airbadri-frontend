/**
 * Sort Utilities
 * 
 * Utilidades para ordenar propiedades según diferentes criterios.
 * Funciones simples y directas para ordenamiento de resultados de búsqueda.
 */

import type { Property } from '../properties/types';

/**
 * Ordena propiedades por relevancia basado en el texto de búsqueda
 * Las propiedades que coinciden en el título tienen mayor prioridad
 * 
 * @param properties - Lista de propiedades a ordenar
 * @param query - Texto de búsqueda
 * @returns Propiedades ordenadas por relevancia
 */
export function sortByRelevance(properties: Property[], query: string): Property[] {
  if (!query || query.trim().length === 0) {
    return properties;
  }

  const queryLower = query.toLowerCase().trim();

  return [...properties].sort((a, b) => {
    // Priorizar coincidencias en el título
    const aTitleMatch = a.title.toLowerCase().includes(queryLower);
    const bTitleMatch = b.title.toLowerCase().includes(queryLower);

    if (aTitleMatch && !bTitleMatch) return -1;
    if (!aTitleMatch && bTitleMatch) return 1;

    // Luego por ubicación
    const aLocationMatch =
      a.location.city.toLowerCase().includes(queryLower) ||
      a.location.country.toLowerCase().includes(queryLower);
    const bLocationMatch =
      b.location.city.toLowerCase().includes(queryLower) ||
      b.location.country.toLowerCase().includes(queryLower);

    if (aLocationMatch && !bLocationMatch) return -1;
    if (!aLocationMatch && bLocationMatch) return 1;

    // Finalmente por rating (mayor rating primero)
    return b.rating - a.rating;
  });
}

/**
 * Ordena propiedades por precio
 * 
 * @param properties - Lista de propiedades a ordenar
 * @param ascending - Si es true, ordena de menor a mayor precio
 * @returns Propiedades ordenadas por precio
 */
export function sortByPrice(properties: Property[], ascending: boolean = true): Property[] {
  return [...properties].sort((a, b) => {
    if (ascending) {
      return a.pricePerNight - b.pricePerNight;
    } else {
      return b.pricePerNight - a.pricePerNight;
    }
  });
}

/**
 * Ordena propiedades por rating
 * Las propiedades con mayor rating aparecen primero
 * 
 * @param properties - Lista de propiedades a ordenar
 * @returns Propiedades ordenadas por rating
 */
export function sortByRating(properties: Property[]): Property[] {
  return [...properties].sort((a, b) => {
    // Primero por rating
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    // Si tienen el mismo rating, por número de reviews
    return b.reviewCount - a.reviewCount;
  });
}

/**
 * Ordena propiedades por fecha de creación
 * Las propiedades más nuevas aparecen primero
 * 
 * @param properties - Lista de propiedades a ordenar
 * @returns Propiedades ordenadas por fecha
 */
export function sortByNewest(properties: Property[]): Property[] {
  return [...properties].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
}





