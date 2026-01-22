/**
 * Pricing Breakdown Component
 * 
 * Componente que muestra el desglose detallado de precios en el checkout.
 * Muestra el precio por noche, subtotal, tarifa de servicio, impuestos y total.
 */

'use client';

import type { PricingBreakdown } from '@/lib/checkout/types';

interface PricingBreakdownProps {
  pricing: PricingBreakdown;
}

export function PricingBreakdownComponent({ pricing }: PricingBreakdownProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-airbnb-bg-300/30">
      <h3 className="text-xl font-bold text-airbnb-text-100 mb-4">
        Desglose de Precios
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-airbnb-text-200">
            €{pricing.pricePerNight} × {pricing.nights} {pricing.nights === 1 ? 'noche' : 'noches'}
          </span>
          <span className="text-airbnb-text-100 font-semibold">
            €{pricing.subtotal.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-airbnb-text-200">Tarifa de servicio</span>
          <span className="text-airbnb-text-100 font-semibold">
            €{pricing.serviceFee.toFixed(2)}
          </span>
        </div>
        
        {pricing.taxes > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-airbnb-text-200">Impuestos</span>
            <span className="text-airbnb-text-100 font-semibold">
              €{pricing.taxes.toFixed(2)}
            </span>
          </div>
        )}
        
        <div className="pt-4 border-t border-airbnb-bg-300">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-airbnb-text-100">Total</span>
            <span className="text-2xl font-bold text-airbnb-primary-100">
              €{pricing.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

