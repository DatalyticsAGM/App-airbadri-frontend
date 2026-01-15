'use client';

import { useEffect } from 'react';
import { initializeMockProperties } from '@/lib/properties/mock-data';
import { initializeMockUsers } from '@/lib/auth/mock-users-data';
import { initializeMockBookings } from '@/lib/bookings/mock-data';
import { initializeMockReviews } from '@/lib/reviews/mock-data';

export function LayoutClient() {
  useEffect(() => {
    // Inicializar en orden: usuarios primero, luego propiedades, luego reservas, luego reviews
    initializeMockUsers();
    initializeMockProperties();
    initializeMockBookings();
    initializeMockReviews();
  }, []);

  return null;
}

