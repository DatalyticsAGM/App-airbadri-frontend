/**
 * Autocomplete Service (Client-side)
 *
 * Por qué existe: entregar sugerencias simples para la barra de búsqueda.
 * Esta versión usa datos locales (constantes) + propiedades desde API.
 */

import type { SearchSuggestion, PopularSearch } from './types';
import { getPropertyService } from '@/lib/api/service-factory';

const NETWORK_DELAY = 200;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

const POPULAR_SEARCHES_DATA: PopularSearch[] = [
  { id: '1', text: 'Apartamentos en Barcelona', location: 'Barcelona, España', count: 1250 },
  { id: '2', text: 'Casas con piscina', location: 'España', count: 890 },
  { id: '3', text: 'Apartamentos cerca de la playa', location: 'Costa', count: 750 },
  { id: '4', text: 'Lofts en Madrid', location: 'Madrid, España', count: 620 },
  { id: '5', text: 'Villas con jardín', location: 'España', count: 540 },
];

async function getLocationSuggestions(text: string): Promise<SearchSuggestion[]> {
  await delay(NETWORK_DELAY);
  if (!text || text.trim().length < 2) return [];

  const textLower = text.toLowerCase().trim();
  const suggestions: SearchSuggestion[] = [];

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

  return suggestions.slice(0, 5);
}

async function getPropertySuggestions(text: string): Promise<SearchSuggestion[]> {
  await delay(NETWORK_DELAY);
  if (!text || text.trim().length < 2) return [];

  try {
    const properties = await getPropertyService().getAllProperties();
    const textLower = text.toLowerCase().trim();
    const suggestions: SearchSuggestion[] = [];

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

    return suggestions.slice(0, 5);
  } catch (error) {
    console.error('Error obteniendo sugerencias de propiedades:', error);
    return [];
  }
}

async function getPopularSearches(): Promise<SearchSuggestion[]> {
  await delay(NETWORK_DELAY);
  return POPULAR_SEARCHES_DATA.map((search) => ({
    id: search.id,
    type: 'popular',
    text: search.text,
    subtitle: search.location,
  }));
}

async function getAllSuggestions(text?: string): Promise<SearchSuggestion[]> {
  const suggestions: SearchSuggestion[] = [];

  if (text && text.trim().length >= 2) {
    const [locations, properties] = await Promise.all([
      getLocationSuggestions(text),
      getPropertySuggestions(text),
    ]);
    suggestions.push(...locations, ...properties);
  } else {
    const popular = await getPopularSearches();
    suggestions.push(...popular);
  }

  return suggestions;
}

export const autocompleteService = {
  getLocationSuggestions,
  getPropertySuggestions,
  getPopularSearches,
  getAllSuggestions,
};

