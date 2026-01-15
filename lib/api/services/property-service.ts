/**
 * Property Service (API Real)
 * 
 * Implementación del servicio de propiedades usando API real.
 * TODO: Implementar cuando el backend esté listo.
 */

import { apiClient } from '../client';
import type { IPropertyService } from '../interfaces';
import type { Property, CreatePropertyData, PropertyFilters } from '../../properties/types';

/**
 * Servicio de propiedades usando API real
 */
export const propertyService: IPropertyService = {
  async getAllProperties() {
    return apiClient.get<Property[]>('/properties');
  },

  async getPropertyById(id) {
    return apiClient.get<Property>(`/properties/${id}`);
  },

  async getPropertiesByHost(hostId) {
    return apiClient.get<Property[]>(`/properties?hostId=${hostId}`);
  },

  async createProperty(data, hostId, hostName) {
    return apiClient.post<Property>('/properties', {
      ...data,
      hostId,
      hostName,
    });
  },

  async updateProperty(id, data) {
    return apiClient.patch<Property>(`/properties/${id}`, data);
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

    return apiClient.get<Property[]>(`/properties/search?${params.toString()}`);
  },
};

