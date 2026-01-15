/**
 * Types for Properties Module
 * 
 * Tipos TypeScript para el módulo de propiedades
 */

export interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    city: string;
    country: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  pricePerNight: number;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  hostId: string;
  hostName: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  propertyType?: string;
  minRating?: number;
  searchText?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
}

export interface CreatePropertyData {
  title: string;
  description: string;
  location: {
    city: string;
    country: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  pricePerNight: number;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  id: string;
}

