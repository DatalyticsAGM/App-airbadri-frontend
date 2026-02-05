/**
 * Favorites Service (Client Storage)
 *
 * Por qué existe: la app necesita una forma simple de guardar favoritos.
 * Hoy se guarda en localStorage; si el backend expone un REST (ej: /favorites),
 * este archivo es el único lugar a reemplazar.
 */

import type { Favorite, CreateFavoriteData } from './types';

const STORAGE_KEY = 'airbnb_favorites';

function getStoredFavorites(): Favorite[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
}

function saveFavorites(favorites: Favorite[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
}

function generateFavoriteId(): string {
  return `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const favoritesService = {
  async getFavoritesByUser(userId: string): Promise<Favorite[]> {
    const favorites = getStoredFavorites();
    return favorites.filter((fav) => fav.userId === userId);
  },

  async addFavorite(data: CreateFavoriteData): Promise<Favorite> {
    const favorites = getStoredFavorites();

    const existing = favorites.find(
      (fav) => fav.userId === data.userId && fav.propertyId === data.propertyId
    );

    if (existing) return existing;

    const newFavorite: Favorite = {
      id: generateFavoriteId(),
      userId: data.userId,
      propertyId: data.propertyId,
      date: new Date().toISOString(),
    };

    favorites.push(newFavorite);
    saveFavorites(favorites);

    return newFavorite;
  },

  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    const favorites = getStoredFavorites();
    const filtered = favorites.filter(
      (fav) => !(fav.userId === userId && fav.propertyId === propertyId)
    );
    saveFavorites(filtered);
  },

  async isFavorite(userId: string, propertyId: string): Promise<boolean> {
    const favorites = getStoredFavorites();
    return favorites.some((fav) => fav.userId === userId && fav.propertyId === propertyId);
  },

  async getFavoritePropertyIds(userId: string): Promise<string[]> {
    const favorites = await this.getFavoritesByUser(userId);
    return favorites.map((fav) => fav.propertyId);
  },
};

