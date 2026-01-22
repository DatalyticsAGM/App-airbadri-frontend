/**
 * Types for Search Module
 * 
 * Tipos TypeScript para el módulo de búsqueda
 */

import type { Property } from '../properties/types';

/**
 * Sugerencia de búsqueda
 * Puede ser una ubicación, una propiedad o una búsqueda popular
 */
export interface SearchSuggestion {
  id: string;
  type: 'location' | 'property' | 'popular';
  text: string;
  subtitle?: string;
  propertyId?: string;
}

/**
 * Historial de búsqueda
 * Guarda las búsquedas recientes del usuario
 */
export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  filters?: {
    location?: string;
    priceRange?: { min: number; max: number };
    guests?: number;
  };
  timestamp: string;
  resultCount?: number;
}

/**
 * Búsqueda popular
 * Búsquedas más frecuentes en la plataforma
 */
export interface PopularSearch {
  id: string;
  text: string;
  location: string;
  count: number;
}





