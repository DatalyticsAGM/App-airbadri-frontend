/**
 * Types for Favorites/Wishlist System
 */

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  date: string; // ISO date string
}

export interface CreateFavoriteData {
  userId: string;
  propertyId: string;
}







