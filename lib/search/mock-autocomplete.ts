/**
 * Mock Autocomplete Service
 * 
 * Servicio MOCK para autocompletado de búsquedas.
 * Proporciona sugerencias de ubicaciones, propiedades y búsquedas populares.
 * 
 * Almacenamiento: localStorage key 'airbnb_search_suggestions'
 */

import type { SearchSuggestion, PopularSearch } from './types';
import { mockProperties } from '../properties/mock-properties';

const STORAGE_KEY = 'airbnb_search_suggestions';
const NETWORK_DELAY = 200;

/**
 * Simula un delay de red
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtiene ubicaciones populares predefinidas
 * Estas son ciudades comunes donde hay propiedades
 */
const POPULAR_LOCATIONS = [
  { city: 'Barcelona', country: 'España' },
  { city: 'Madrid', country: 'España' },
  { city: 'Valencia', country: 'España' },
  { city: 'Sevilla', country: 'España' },
  { city: 'Bilbao', country: 'España' },
  { city: 'Málaga', country: 'España' },
  { city: 'Granada', country: 'España' },
  { city: 'Santiago de Compostela', country: 'España' },
  { city: 'Palma de Mallorca', country: 'España' },
  { city: 'San Sebastián', country: 'España' },
];

/**
 * Búsquedas populares predefinidas
 */
const POPULAR_SEARCHES_DATA: PopularSearch[] = [
  { id: '1', text: 'Apartamentos en Barcelona', location: 'Barcelona, España', count: 1250 },
  { id: '2', text: 'Casas con piscina', location: 'España', count: 890 },
  { id: '3', text: 'Apartamentos cerca de la playa', location: 'Costa', count: 750 },
  { id: '4', text: 'Lofts en Madrid', location: 'Madrid, España', count: 620 },
  { id: '5', text: 'Villas con jardín', location: 'España', count: 540 },
];

/**
 * Obtiene sugerencias de ubicaciones basadas en el texto de búsqueda
 * 
 * @param text - Texto de búsqueda del usuario
 * @returns Lista de sugerencias de ubicaciones
 */
async function getLocationSuggestions(text: string): Promise<SearchSuggestion[]> {
  await delay(NETWORK_DELAY);

  if (!text || text.trim().length < 2) {
    return [];
  }

  const textLower = text.toLowerCase().trim();
  const suggestions: SearchSuggestion[] = [];

  // Buscar en ubicaciones populares
  for (const location of POPULAR_LOCATIONS) {
    if (
      location.city.toLowerCase().includes(textLower) ||
      location.country.toLowerCase().includes(textLower)
    ) {
      suggestions.push({
        id: `location_${location.city}`,
        type: 'location',
        text: location.city,
        subtitle: location.country,
      });
    }
  }

  // Limitar a 5 sugerencias
  return suggestions.slice(0, 5);
}

/**
 * Obtiene sugerencias de propiedades basadas en el texto de búsqueda
 * Busca en títulos y descripciones de propiedades
 * 
 * @param text - Texto de búsqueda del usuario
 * @returns Lista de sugerencias de propiedades
 */
async function getPropertySuggestions(text: string): Promise<SearchSuggestion[]> {
  await delay(NETWORK_DELAY);

  if (!text || text.trim().length < 2) {
    return [];
  }

  try {
    const properties = await mockProperties.getAllProperties();
    const textLower = text.toLowerCase().trim();
    const suggestions: SearchSuggestion[] = [];

    // Buscar en títulos y descripciones
    for (const property of properties) {
      const titleMatch = property.title.toLowerCase().includes(textLower);
      const descMatch = property.description.toLowerCase().includes(textLower);
      const locationMatch =
        property.location.city.toLowerCase().includes(textLower) ||
        property.location.country.toLowerCase().includes(textLower);

      if (titleMatch || descMatch || locationMatch) {
        suggestions.push({
          id: `property_${property.id}`,
          type: 'property',
          text: property.title,
          subtitle: `${property.location.city}, ${property.location.country}`,
          propertyId: property.id,
        });
      }
    }

    // Limitar a 5 sugerencias
    return suggestions.slice(0, 5);
  } catch (error) {
    console.error('Error obteniendo sugerencias de propiedades:', error);
    return [];
  }
}

/**
 * Obtiene búsquedas populares
 * Retorna las búsquedas más frecuentes en la plataforma
 * 
 * @returns Lista de búsquedas populares
 */
async function getPopularSearches(): Promise<SearchSuggestion[]> {
  await delay(NETWORK_DELAY);

  return POPULAR_SEARCHES_DATA.map(search => ({
    id: search.id,
    type: 'popular',
    text: search.text,
    subtitle: search.location,
  }));
}

/**
 * Obtiene todas las sugerencias combinadas
 * Combina sugerencias de ubicaciones, propiedades y búsquedas populares
 * 
 * @param text - Texto de búsqueda (opcional)
 * @returns Lista combinada de sugerencias
 */
async function getAllSuggestions(text?: string): Promise<SearchSuggestion[]> {
  const suggestions: SearchSuggestion[] = [];

  // Si hay texto, buscar sugerencias
  if (text && text.trim().length >= 2) {
    const [locations, properties] = await Promise.all([
      getLocationSuggestions(text),
      getPropertySuggestions(text),
    ]);
    suggestions.push(...locations, ...properties);
  } else {
    // Si no hay texto, mostrar búsquedas populares
    const popular = await getPopularSearches();
    suggestions.push(...popular);
  }

  return suggestions;
}

/**
 * Servicio de autocompletado MOCK
 */
export const mockAutocomplete = {
  getLocationSuggestions,
  getPropertySuggestions,
  getPopularSearches,
  getAllSuggestions,
};





