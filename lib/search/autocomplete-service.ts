/**
 * Autocomplete Service (API Real)
 *
 * Por qué existe: entregar sugerencias para la barra de búsqueda basadas en datos reales
 * del backend (propiedades y ubicaciones). Evitamos datos hardcodeados para no simular
 * resultados que no existen en producción.
 */

import type { SearchSuggestion, PopularSearch } from './types';
import { getPropertyService } from '@/lib/api/service-factory';

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

async function getAllPropertiesSafe() {
  try {
    return await getPropertyService().getAllProperties();
  } catch (error) {
    console.error('Error obteniendo propiedades para autocomplete:', error);
    return [];
  }
}

async function getLocationSuggestions(text: string): Promise<SearchSuggestion[]> {
  if (!text || text.trim().length < 2) return [];

  const textLower = normalizeText(text);
  const properties = await getAllPropertiesSafe();

  // Deduplicar ubicaciones reales desde propiedades
  const seen = new Set<string>();
  const suggestions: SearchSuggestion[] = [];

  for (const property of properties) {
    const city = property.location?.city ?? '';
    const country = property.location?.country ?? '';
    const key = `${city}|${country}`.toLowerCase();

    if (!city) continue;
    if (seen.has(key)) continue;

    if (normalizeText(city).includes(textLower) || normalizeText(country).includes(textLower)) {
      seen.add(key);
      suggestions.push({
        id: `location_${key}`,
        type: 'location',
        text: city,
        subtitle: country,
      });
    }
  }

  return suggestions.slice(0, 5);
}

async function getPropertySuggestions(text: string): Promise<SearchSuggestion[]> {
  if (!text || text.trim().length < 2) return [];

  const properties = await getAllPropertiesSafe();
  const textLower = normalizeText(text);
  const suggestions: SearchSuggestion[] = [];

  for (const property of properties) {
    const titleMatch = normalizeText(property.title).includes(textLower);
    const descMatch = normalizeText(property.description).includes(textLower);
    const locationMatch =
      normalizeText(property.location?.city ?? '').includes(textLower) ||
      normalizeText(property.location?.country ?? '').includes(textLower);

    if (titleMatch || descMatch || locationMatch) {
      suggestions.push({
        id: `property_${property.id}`,
        type: 'property',
        text: property.title,
        subtitle: `${property.location?.city ?? ''}, ${property.location?.country ?? ''}`.trim(),
        propertyId: property.id,
      });
    }
  }

  return suggestions.slice(0, 5);
}

async function getPopularSearches(): Promise<SearchSuggestion[]> {
  const properties = await getAllPropertiesSafe();

  // Top ubicaciones por cantidad de propiedades
  const counts = new Map<string, { city: string; country: string; count: number }>();
  for (const p of properties) {
    const city = p.location?.city ?? '';
    const country = p.location?.country ?? '';
    if (!city) continue;

    const key = `${city}|${country}`.toLowerCase();
    const existing = counts.get(key);
    counts.set(key, {
      city,
      country,
      count: (existing?.count ?? 0) + 1,
    });
  }

  const popular: PopularSearch[] = Array.from(counts.entries())
    .map(([id, v]) => ({
      id,
      text: `Alojamientos en ${v.city}`,
      location: v.country ? `${v.city}, ${v.country}` : v.city,
      count: v.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return popular.map((search) => ({
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

