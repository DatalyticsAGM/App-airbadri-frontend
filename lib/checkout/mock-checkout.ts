/**
 * Mock Checkout Service
 * 
 * Servicio MOCK para gestión de checkout que calcula precios y valida datos.
 * NO requiere backend ni base de datos real.
 * 
 * Este servicio se encarga de:
 * - Obtener y preparar datos de checkout
 * - Calcular el desglose de precios (subtotal, servicios, impuestos, total)
 * - Validar que los datos sean correctos antes de confirmar la reserva
 */

import type { CheckoutData, PricingBreakdown, CheckoutFormData } from './types';
import type { Property } from '../properties/types';
import { mockProperties } from '../properties/mock-properties';

// Constante para key de localStorage temporal
const MOCK_CHECKOUT_KEY = 'airbnb_mock_checkout_temp';

// Simulación de delay de red
const NETWORK_DELAY = 200;

/**
 * Simula un delay de red
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calcula el número de noches entre dos fechas
 * Esta función es necesaria para calcular el precio total de la reserva
 */
function calculateNights(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Calcula el desglose de precios para una reserva
 * 
 * Esta función calcula:
 * - Subtotal: precio por noche × número de noches
 * - Tarifa de servicio: 10% del subtotal (comisión de la plataforma)
 * - Impuestos: 0% (puede ajustarse según país)
 * - Total: suma de todo lo anterior
 * 
 * @param property - La propiedad que se está reservando
 * @param nights - Número de noches de la reserva
 * @param guests - Número de huéspedes (puede afectar precios en el futuro)
 */
export function calculatePricing(
  property: Property,
  nights: number,
  guests: number
): PricingBreakdown {
  const pricePerNight = property.pricePerNight;
  const subtotal = pricePerNight * nights;
  
  // Tarifa de servicio del 10% del subtotal
  // Esta es una comisión estándar de la plataforma
  const serviceFee = Math.round(subtotal * 0.1 * 100) / 100;
  
  // Impuestos (0% por defecto, puede ajustarse según país)
  const taxes = 0;
  
  // Total es la suma de todo
  const total = subtotal + serviceFee + taxes;
  
  return {
    pricePerNight,
    nights,
    subtotal,
    serviceFee,
    taxes,
    total,
  };
}

/**
 * Obtiene los datos completos de checkout para una reserva
 * 
 * Esta función obtiene la propiedad y calcula todos los datos necesarios
 * para mostrar en la pantalla de checkout, incluyendo el desglose de precios.
 * 
 * @param propertyId - ID de la propiedad a reservar
 * @param checkIn - Fecha de entrada (ISO string)
 * @param checkOut - Fecha de salida (ISO string)
 * @param guests - Número de huéspedes
 */
export async function getCheckoutData(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  guests: number
): Promise<CheckoutData> {
  await delay(NETWORK_DELAY);
  
  // Obtener la propiedad
  const property = await mockProperties.getPropertyById(propertyId);
  if (!property) {
    throw new Error('Propiedad no encontrada');
  }
  
  // Validar que las fechas sean válidas
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    throw new Error('Fechas inválidas');
  }
  
  if (checkOutDate <= checkInDate) {
    throw new Error('La fecha de salida debe ser posterior a la de entrada');
  }
  
  // Validar número de huéspedes
  if (guests < 1) {
    throw new Error('Debe haber al menos un huésped');
  }
  
  if (guests > property.maxGuests) {
    throw new Error(`La propiedad solo acepta hasta ${property.maxGuests} huéspedes`);
  }
  
  // Calcular número de noches
  const nights = calculateNights(checkIn, checkOut);
  
  // Calcular desglose de precios
  const pricing = calculatePricing(property, nights, guests);
  
  return {
    property,
    checkIn,
    checkOut,
    guests,
    pricing,
  };
}

/**
 * Valida los datos del formulario de checkout antes de confirmar
 * 
 * Esta función verifica que todos los campos requeridos estén completos
 * y que el formato del email sea válido.
 * 
 * @param formData - Datos del formulario a validar
 */
export function validateCheckoutData(formData: CheckoutFormData): { valid: boolean; error?: string } {
  // Validar que el nombre esté completo
  if (!formData.fullName || formData.fullName.trim().length === 0) {
    return { valid: false, error: 'El nombre completo es requerido' };
  }
  
  // Validar que el email esté completo
  if (!formData.email || formData.email.trim().length === 0) {
    return { valid: false, error: 'El email es requerido' };
  }
  
  // Validar formato básico de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { valid: false, error: 'El formato del email no es válido' };
  }
  
  return { valid: true };
}

/**
 * Guarda datos temporales de checkout en localStorage
 * Útil para mantener el estado si el usuario recarga la página
 */
export function saveCheckoutTemp(data: Partial<CheckoutData>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MOCK_CHECKOUT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error guardando datos temporales de checkout:', error);
  }
}

/**
 * Obtiene datos temporales de checkout desde localStorage
 */
export function getCheckoutTemp(): Partial<CheckoutData> | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(MOCK_CHECKOUT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Limpia datos temporales de checkout
 */
export function clearCheckoutTemp(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(MOCK_CHECKOUT_KEY);
  } catch (error) {
    console.error('Error limpiando datos temporales de checkout:', error);
  }
}

