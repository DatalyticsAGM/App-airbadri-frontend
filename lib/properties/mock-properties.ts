/**
 * Mock Properties Service
 * 
 * Servicio MOCK para gestión de propiedades que almacena datos en localStorage.
 * NO requiere backend ni base de datos real.
 * 
 * Almacenamiento:
 * - Propiedades: localStorage key 'airbnb_mock_properties'
 */

import type { Property, PropertyFilters, CreatePropertyData, UpdatePropertyData } from './types';

// Constante para key de localStorage
const MOCK_PROPERTIES_KEY = 'airbnb_mock_properties';

// Simulación de delay de red
const NETWORK_DELAY = 300;

/**
 * Simula un delay de red
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtiene todas las propiedades del localStorage
 */
function getProperties(): Property[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(MOCK_PROPERTIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda propiedades en localStorage
 */
function saveProperties(properties: Property[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MOCK_PROPERTIES_KEY, JSON.stringify(properties));
  } catch (error) {
    console.error('Error guardando propiedades:', error);
  }
}

/**
 * Genera un ID único para una propiedad
 */
function generatePropertyId(): string {
  return `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Servicio MOCK de propiedades
 */
export const mockProperties = {
  /**
   * Obtiene todas las propiedades
   */
  async getAllProperties(): Promise<Property[]> {
    await delay(NETWORK_DELAY);
    return getProperties();
  },

  /**
   * Obtiene una propiedad por ID
   */
  async getPropertyById(id: string): Promise<Property | null> {
    await delay(NETWORK_DELAY);
    const properties = getProperties();
    return properties.find(p => p.id === id) || null;
  },

  /**
   * Obtiene propiedades de un host específico
   */
  async getPropertiesByHost(hostId: string): Promise<Property[]> {
    await delay(NETWORK_DELAY);
    const properties = getProperties();
    return properties.filter(p => p.hostId === hostId);
  },

  /**
   * Crea una nueva propiedad
   */
  async createProperty(data: CreatePropertyData, hostId: string, hostName: string): Promise<Property> {
    await delay(NETWORK_DELAY);

    const now = new Date().toISOString();
    const newProperty: Property = {
      id: generatePropertyId(),
      ...data,
      hostId,
      hostName,
      rating: 0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const properties = getProperties();
    properties.push(newProperty);
    saveProperties(properties);

    return newProperty;
  },

  /**
   * Actualiza una propiedad existente
   */
  async updateProperty(id: string, data: Partial<CreatePropertyData>): Promise<Property | null> {
    await delay(NETWORK_DELAY);

    const properties = getProperties();
    const index = properties.findIndex(p => p.id === id);

    if (index === -1) {
      return null;
    }

    properties[index] = {
      ...properties[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    saveProperties(properties);
    return properties[index];
  },

  /**
   * Elimina una propiedad
   */
  async deleteProperty(id: string): Promise<boolean> {
    await delay(NETWORK_DELAY);

    const properties = getProperties();
    const filtered = properties.filter(p => p.id !== id);

    if (filtered.length === properties.length) {
      return false; // No se encontró la propiedad
    }

    saveProperties(filtered);
    return true;
  },

  /**
   * Busca propiedades con filtros
   */
  async searchProperties(filters: PropertyFilters): Promise<Property[]> {
    await delay(NETWORK_DELAY);

    let properties = getProperties();

    // Filtro por ubicación
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      properties = properties.filter(
        p =>
          p.location.city.toLowerCase().includes(locationLower) ||
          p.location.country.toLowerCase().includes(locationLower) ||
          p.location.address.toLowerCase().includes(locationLower)
      );
    }

    // Filtro por rango de precio
    if (filters.priceRange) {
      properties = properties.filter(
        p =>
          p.pricePerNight >= filters.priceRange!.min &&
          p.pricePerNight <= filters.priceRange!.max
      );
    }

    // Filtro por amenities
    if (filters.amenities && filters.amenities.length > 0) {
      properties = properties.filter(p =>
        filters.amenities!.every(amenity => p.amenities.includes(amenity))
      );
    }

    // Filtro por número de habitaciones
    if (filters.bedrooms !== undefined) {
      properties = properties.filter(p => p.bedrooms >= filters.bedrooms!);
    }

    // Filtro por número de baños
    if (filters.bathrooms !== undefined) {
      properties = properties.filter(p => p.bathrooms >= filters.bathrooms!);
    }

    // Filtro por capacidad máxima
    if (filters.maxGuests !== undefined) {
      properties = properties.filter(p => p.maxGuests >= filters.maxGuests!);
    }

    return properties;
  },
};

