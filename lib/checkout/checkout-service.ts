/**
 * Checkout Service
 *
 * Por qué existe: agrupa lógica de pricing y validaciones del checkout.
 * - La propiedad se obtiene vía API real.
 * - El estado temporal se guarda en localStorage para tolerar refresh.
 */

import type { CheckoutData, PricingBreakdown, CheckoutFormData } from './types';
import type { Property } from '../properties/types';
import { getPropertyService } from '@/lib/api/service-factory';

const CHECKOUT_TEMP_KEY = 'airbnb_checkout_temp';

function calculateNights(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function calculatePricing(property: Property, nights: number, guests: number): PricingBreakdown {
  const pricePerNight = property.pricePerNight;
  const subtotal = pricePerNight * nights;

  // Comisión simple de plataforma (10%)
  const serviceFee = Math.round(subtotal * 0.1 * 100) / 100;

  const taxes = 0;
  const total = subtotal + serviceFee + taxes;

  return { pricePerNight, nights, subtotal, serviceFee, taxes, total };
}

export async function getCheckoutData(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  guests: number
): Promise<CheckoutData> {
  // Obtener la propiedad desde API real
  const property = await getPropertyService().getPropertyById(propertyId);
  if (!property) {
    throw new Error('Propiedad no encontrada');
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    throw new Error('Fechas inválidas');
  }

  if (checkOutDate <= checkInDate) {
    throw new Error('La fecha de salida debe ser posterior a la de entrada');
  }

  if (guests < 1) {
    throw new Error('Debe haber al menos un huésped');
  }

  if (guests > property.maxGuests) {
    throw new Error(`La propiedad solo acepta hasta ${property.maxGuests} huéspedes`);
  }

  const nights = calculateNights(checkIn, checkOut);
  const pricing = calculatePricing(property, nights, guests);

  return { property, checkIn, checkOut, guests, pricing };
}

export function validateCheckoutData(formData: CheckoutFormData): { valid: boolean; error?: string } {
  if (!formData.fullName || formData.fullName.trim().length === 0) {
    return { valid: false, error: 'El nombre completo es requerido' };
  }

  if (!formData.email || formData.email.trim().length === 0) {
    return { valid: false, error: 'El email es requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { valid: false, error: 'El formato del email no es válido' };
  }

  return { valid: true };
}

export function saveCheckoutTemp(data: Partial<CheckoutData>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHECKOUT_TEMP_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error guardando datos temporales de checkout:', error);
  }
}

export function getCheckoutTemp(): Partial<CheckoutData> | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CHECKOUT_TEMP_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearCheckoutTemp(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CHECKOUT_TEMP_KEY);
  } catch (error) {
    console.error('Error limpiando datos temporales de checkout:', error);
  }
}

