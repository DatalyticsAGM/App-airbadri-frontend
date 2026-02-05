/**
 * Favorites Service (API Real)
 *
 * Por qué existe: la UI (botón de favoritos / página de favoritos) necesita
 * persistencia real en backend (no localStorage) para que sea consistente
 * entre dispositivos y sesiones.
 */

import type { Favorite, CreateFavoriteData } from './types';
import { apiClient, ApiClientError } from '@/lib/api/client';

function unwrapList(raw: any): any[] {
  const list = Array.isArray(raw) ? raw : raw?.data ?? raw?.favorites ?? raw?.items ?? raw?.results ?? [];
  return Array.isArray(list) ? list : [];
}

function coerceString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function normalizeFavorite(raw: any): Favorite {
  return {
    id: coerceString(raw?.id || raw?._id),
    userId: coerceString(raw?.userId),
    propertyId: coerceString(raw?.propertyId),
    date: coerceString(raw?.date || raw?.createdAt) || new Date().toISOString(),
  };
}

export const favoritesService = {
  async getFavoritesByUser(userId: string): Promise<Favorite[]> {
    // La mayoría de APIs devuelven favoritos del usuario actual en `GET /favorites`.
    // Dejamos `userId` como query opcional por compatibilidad.
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const raw = await apiClient.get<any>(`/favorites${query}`);
    return unwrapList(raw).map(normalizeFavorite);
  },

  async addFavorite(data: CreateFavoriteData): Promise<Favorite> {
    const raw = await apiClient.post<any>('/favorites', data);
    const item = raw?.data ?? raw?.favorite ?? raw;
    return normalizeFavorite(item);
  },

  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    // Intento 1: DELETE por query (simple)
    try {
      await apiClient.delete(`/favorites?userId=${encodeURIComponent(userId)}&propertyId=${encodeURIComponent(propertyId)}`);
      return;
    } catch (error) {
      // Intento 2: DELETE por recurso /favorites/:propertyId
      if (error instanceof ApiClientError && (error.status === 404 || error.status === 405)) {
        await apiClient.delete(`/favorites/${encodeURIComponent(propertyId)}`);
        return;
      }
      throw error;
    }
  },

  async isFavorite(userId: string, propertyId: string): Promise<boolean> {
    const favorites = await this.getFavoritesByUser(userId);
    return favorites.some((fav) => fav.propertyId === propertyId);
  },

  async getFavoritePropertyIds(userId: string): Promise<string[]> {
    const favorites = await this.getFavoritesByUser(userId);
    return favorites.map((fav) => fav.propertyId);
  },
};

