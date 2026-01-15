/**
 * Tests for Mock Bookings Service
 */

import { mockBookings } from '../mock-bookings';
import { mockProperties } from '../../properties/mock-properties';
import type { CreateBookingData } from '../types';

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

describe('Mock Bookings Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  let propertyId: string;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);

  beforeEach(async () => {
    const property = await mockProperties.createProperty(
      {
        title: 'Test Property',
        description: 'Test',
        location: {
          city: 'Test City',
          country: 'Test Country',
          address: 'Test Address',
        },
        pricePerNight: 100,
        images: [],
        amenities: [],
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
      },
      'host-1',
      'Host'
    );
    propertyId = property.id;
  });

  describe('createBooking', () => {
    it('should create a booking', async () => {
      const bookingData: CreateBookingData = {
        propertyId,
        checkIn: tomorrow.toISOString(),
        checkOut: dayAfter.toISOString(),
        guests: 2,
      };

      const booking = await mockBookings.createBooking(bookingData, 'user-1');
      expect(booking).toBeDefined();
      expect(booking.propertyId).toBe(propertyId);
      expect(booking.userId).toBe('user-1');
    });

    it('should throw error for non-existent property', async () => {
      const bookingData: CreateBookingData = {
        propertyId: 'non-existent',
        checkIn: tomorrow.toISOString(),
        checkOut: dayAfter.toISOString(),
        guests: 2,
      };

      await expect(
        mockBookings.createBooking(bookingData, 'user-1')
      ).rejects.toThrow();
    });
  });

  describe('checkAvailability', () => {
    it('should return available when no bookings', async () => {
      const availability = await mockBookings.checkAvailability(
        propertyId,
        tomorrow.toISOString(),
        dayAfter.toISOString()
      );
      expect(availability.available).toBe(true);
    });

    it('should return unavailable when dates overlap', async () => {
      const bookingData: CreateBookingData = {
        propertyId,
        checkIn: tomorrow.toISOString(),
        checkOut: dayAfter.toISOString(),
        guests: 2,
      };

      await mockBookings.createBooking(bookingData, 'user-1');

      const availability = await mockBookings.checkAvailability(
        propertyId,
        tomorrow.toISOString(),
        dayAfter.toISOString()
      );
      expect(availability.available).toBe(false);
    });
  });

  describe('getBookingsByUser', () => {
    it('should return bookings for user', async () => {
      const bookingData: CreateBookingData = {
        propertyId,
        checkIn: tomorrow.toISOString(),
        checkOut: dayAfter.toISOString(),
        guests: 2,
      };

      await mockBookings.createBooking(bookingData, 'user-1');
      const bookings = await mockBookings.getBookingsByUser('user-1');

      expect(bookings.length).toBeGreaterThan(0);
      expect(bookings.every(b => b.userId === 'user-1')).toBe(true);
    });
  });
});

