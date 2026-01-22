/**
 * Types for Checkout Module
 * 
 * Tipos TypeScript para el módulo de checkout
 */

import type { Property } from '../properties/types';

/**
 * Desglose de precios para el checkout
 * Muestra el subtotal, servicios, impuestos y total final
 */
export interface PricingBreakdown {
  pricePerNight: number;
  nights: number;
  subtotal: number;
  serviceFee: number;
  taxes: number;
  total: number;
}

/**
 * Datos completos de checkout
 * Incluye la propiedad, fechas, huéspedes y desglose de precios
 */
export interface CheckoutData {
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  pricing: PricingBreakdown;
}

/**
 * Datos del formulario de checkout
 * Información del usuario que se puede editar antes de confirmar
 */
export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone?: string;
  creditCard?: string;
}

