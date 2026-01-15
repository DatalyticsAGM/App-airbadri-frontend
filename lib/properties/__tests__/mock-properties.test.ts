/**
 * Tests for Mock Properties Service
 */

import { mockProperties } from '../mock-properties';
import type { CreatePropertyData } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Mock Properties Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const sampleProperty: CreatePropertyData = {
    title: 'Test Property',
    description: 'A test property',
    location: {
      city: 'Test City',
      country: 'Test Country',
      address: 'Test Address 123',
    },
    pricePerNight: 100,
    images: ['https://example.com/image.jpg'],
    amenities: ['wifi', 'parking'],
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
  };

  describe('createProperty', () => {
    it('should create a new property', async () => {
      const property = await mockProperties.createProperty(
        sampleProperty,
        'host-1',
        'Host Name'
      );

      expect(property).toBeDefined();
      expect(property.title).toBe('Test Property');
      expect(property.hostId).toBe('host-1');
    });
  });

  describe('getAllProperties', () => {
    it('should return empty array when no properties', async () => {
      const properties = await mockProperties.getAllProperties();
      expect(properties).toEqual([]);
    });

    it('should return all properties', async () => {
      await mockProperties.createProperty(sampleProperty, 'host-1', 'Host');
      const properties = await mockProperties.getAllProperties();
      expect(properties.length).toBeGreaterThan(0);
    });
  });

  describe('getPropertyById', () => {
    it('should return null for non-existent property', async () => {
      const property = await mockProperties.getPropertyById('non-existent');
      expect(property).toBeNull();
    });

    it('should return property by id', async () => {
      const created = await mockProperties.createProperty(
        sampleProperty,
        'host-1',
        'Host'
      );
      const found = await mockProperties.getPropertyById(created.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });
  });

  describe('updateProperty', () => {
    it('should update property', async () => {
      const created = await mockProperties.createProperty(
        sampleProperty,
        'host-1',
        'Host'
      );
      const updated = await mockProperties.updateProperty(created.id, {
        title: 'Updated Title',
      });

      expect(updated?.title).toBe('Updated Title');
    });

    it('should return null for non-existent property', async () => {
      const updated = await mockProperties.updateProperty('non-existent', {
        title: 'Updated',
      });
      expect(updated).toBeNull();
    });
  });

  describe('deleteProperty', () => {
    it('should delete property', async () => {
      const created = await mockProperties.createProperty(
        sampleProperty,
        'host-1',
        'Host'
      );
      const deleted = await mockProperties.deleteProperty(created.id);
      expect(deleted).toBe(true);

      const found = await mockProperties.getPropertyById(created.id);
      expect(found).toBeNull();
    });

    it('should return false for non-existent property', async () => {
      const deleted = await mockProperties.deleteProperty('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('searchProperties', () => {
    beforeEach(async () => {
      await mockProperties.createProperty(
        { ...sampleProperty, location: { city: 'Barcelona', country: 'Spain', address: 'Barcelona St 1' }, pricePerNight: 50 },
        'host-1',
        'Host'
      );
      await mockProperties.createProperty(
        { ...sampleProperty, location: { city: 'Madrid', country: 'Spain', address: 'Madrid St 1' }, pricePerNight: 150 },
        'host-2',
        'Host 2'
      );
    });

    it('should filter by location', async () => {
      const results = await mockProperties.searchProperties({
        location: 'Barcelona',
      });
      expect(results.every(p => p.location.city.includes('Barcelona') || p.location.country.includes('Barcelona'))).toBe(true);
    });

    it('should filter by price range', async () => {
      const results = await mockProperties.searchProperties({
        priceRange: { min: 0, max: 100 },
      });
      expect(results.every(p => p.pricePerNight <= 100)).toBe(true);
    });
  });
});

