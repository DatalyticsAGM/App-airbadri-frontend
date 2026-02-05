/**
 * Property Service (API Real)
 * 
 * Implementación del servicio de propiedades usando API real.
 * TODO: Implementar cuando el backend esté listo.
 */

import { apiClient } from '../client';
import type { IPropertyService } from '../interfaces';
import type { Property, CreatePropertyData, PropertyFilters } from '../../properties/types';

function coerceString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function coerceNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function coerceStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string') as string[];
  return [];
}

function normalizeLocation(raw: any): Property['location'] {
  // La documentación del proyecto a veces usa `location` como string "Ciudad, País"
  if (typeof raw === 'string') {
    const [city, ...rest] = raw.split(',').map((s) => s.trim()).filter(Boolean);
    return {
      city: city || raw,
      country: rest.join(', ') || '',
      address: '',
    };
  }

  const city = coerceString(raw?.city);
  const country = coerceString(raw?.country);
  const address = coerceString(raw?.address);
  const lat = raw?.coordinates?.lat;
  const lng = raw?.coordinates?.lng;

  return {
    city,
    country,
    address,
    coordinates:
      typeof lat === 'number' && typeof lng === 'number'
        ? { lat, lng }
        : undefined,
  };
}

function normalizeProperty(raw: any): Property {
  const id = coerceString(raw?.id || raw?._id);
  const title = coerceString(raw?.title);
  const description = coerceString(raw?.description);

  return {
    id,
    title,
    description,
    location: normalizeLocation(raw?.location),
    pricePerNight: coerceNumber(raw?.pricePerNight, 0),
    images: coerceStringArray(raw?.images),
    amenities: coerceStringArray(raw?.amenities),
    bedrooms: coerceNumber(raw?.bedrooms, 0),
    bathrooms: coerceNumber(raw?.bathrooms, 0),
    maxGuests: coerceNumber(raw?.maxGuests, 0),
    hostId: coerceString(raw?.hostId),
    hostName: coerceString(raw?.hostName),
    rating: coerceNumber(raw?.rating, 0),
    reviewCount: coerceNumber(raw?.reviewCount, 0),
    createdAt: coerceString(raw?.createdAt) || new Date().toISOString(),
    updatedAt: coerceString(raw?.updatedAt) || new Date().toISOString(),
  };
}

function unwrapList(raw: any): any[] {
  const list =
    Array.isArray(raw)
      ? raw
      : raw?.data ?? raw?.properties ?? raw?.items ?? raw?.results ?? [];
  return Array.isArray(list) ? list : [];
}

function unwrapItem(raw: any): any {
  return raw?.data ?? raw?.property ?? raw?.item ?? raw;
}

/**
 * Servicio de propiedades usando API real
 */
export const propertyService: IPropertyService = {
  async getAllProperties() {
    const raw = await apiClient.get<any>('/properties');
    return unwrapList(raw).map(normalizeProperty);
  },

  async getPropertyById(id) {
    const raw = await apiClient.get<any>(`/properties/${id}`);
    const item = unwrapItem(raw);
    return normalizeProperty(item);
  },

  async getPropertiesByHost(hostId) {
    const raw = await apiClient.get<any>(`/properties?hostId=${hostId}`);
    return unwrapList(raw).map(normalizeProperty);
  },

  async createProperty(data, hostId, hostName) {
    const raw = await apiClient.post<any>('/properties', {
      ...data,
      hostId,
      hostName,
    });
    return normalizeProperty(unwrapItem(raw));
  },

  async updateProperty(id, data) {
    const raw = await apiClient.patch<any>(`/properties/${id}`, data);
    return normalizeProperty(unwrapItem(raw));
  },

  async deleteProperty(id) {
    await apiClient.delete(`/properties/${id}`);
    return true;
  },

  async searchProperties(filters) {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.priceRange) {
      params.append('minPrice', filters.priceRange.min.toString());
      params.append('maxPrice', filters.priceRange.max.toString());
    }
    // Agregar más filtros según sea necesario

    const raw = await apiClient.get<any>(`/properties/search?${params.toString()}`);
    return unwrapList(raw).map(normalizeProperty);
  },
};







