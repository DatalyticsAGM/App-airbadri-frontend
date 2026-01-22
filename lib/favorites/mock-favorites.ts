/**
 * Mock Favorites Service
 * 
 * Servicio MOCK para gestión de favoritos/wishlist
 * Almacena datos en localStorage
 */

import type { Favorite, CreateFavoriteData } from './types';

const STORAGE_KEY = 'airbnb_favorites';

/**
 * Obtener todos los favoritos del localStorage
 */
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

/**
 * Guardar favoritos en localStorage
 */
function saveFavorites(favorites: Favorite[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
}

/**
 * Generar ID único para favorito
 */
function generateFavoriteId(): string {
  return `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const mockFavorites = {
  /**
   * Obtener todos los favoritos de un usuario
   */
  async getFavoritesByUser(userId: string): Promise<Favorite[]> {
    const favorites = getStoredFavorites();
    return favorites.filter(fav => fav.userId === userId);
  },

  /**
   * Agregar una propiedad a favoritos
   */
  async addFavorite(data: CreateFavoriteData): Promise<Favorite> {
    const favorites = getStoredFavorites();
    
    // Verificar si ya existe
    const existing = favorites.find(
      fav => fav.userId === data.userId && fav.propertyId === data.propertyId
    );
    
    if (existing) {
      return existing;
    }

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

  /**
   * Eliminar una propiedad de favoritos
   */
  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    const favorites = getStoredFavorites();
    const filtered = favorites.filter(
      fav => !(fav.userId === userId && fav.propertyId === propertyId)
    );
    saveFavorites(filtered);
  },

  /**
   * Verificar si una propiedad está en favoritos
   */
  async isFavorite(userId: string, propertyId: string): Promise<boolean> {
    const favorites = getStoredFavorites();
    return favorites.some(
      fav => fav.userId === userId && fav.propertyId === propertyId
    );
  },

  /**
   * Obtener IDs de propiedades favoritas de un usuario
   */
  async getFavoritePropertyIds(userId: string): Promise<string[]> {
    const favorites = await this.getFavoritesByUser(userId);
    return favorites.map(fav => fav.propertyId);
  },
};







