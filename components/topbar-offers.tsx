/**
 * Topbar Offers Component
 *
 * Barra superior con ofertas de última hora
 * Diseño llamativo y urgente para captar la atención
 */

'use client';

import { X, Zap } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface TopbarOffersProps {
  discount?: number;
  maxPeople?: number;
  message?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function TopbarOffers({
  discount = 40,
  maxPeople = 10,
  message,
  ctaText = 'Aprovecha ahora',
  ctaLink = '#promotions',
}: TopbarOffersProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const defaultMessage = `🔥 Ofertas de ${discount}% para las primeras ${maxPeople} personas`;

  return (
    <div className="bg-gradient-to-r from-airbnb-primary-100 via-airbnb-primary-200 to-airbnb-primary-100 text-white relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Left side - Message */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Zap className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <p className="text-sm sm:text-base font-semibold truncate">
              {message || defaultMessage}
            </p>
          </div>

          {/* Right side - CTA and Close button */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <Link
              href={ctaLink}
              className="hidden sm:inline-flex items-center px-4 py-1.5 bg-white text-airbnb-primary-100 rounded-full font-semibold text-sm hover:bg-airbnb-bg-200 transition-colors whitespace-nowrap"
            >
              {ctaText}
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
              aria-label="Cerrar oferta"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile CTA - Show below on small screens */}
      <div className="sm:hidden relative pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={ctaLink}
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-white text-airbnb-primary-100 rounded-full font-semibold text-sm hover:bg-airbnb-bg-200 transition-colors"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}









