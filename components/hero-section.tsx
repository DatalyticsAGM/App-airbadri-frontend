/**
 * Hero Section Component
 *
 * Sección principal con headline y call-to-action
 * Inspirado en el diseño de Airbnb con background image
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
      {/* Background Image */}
      {/* TODO: Reemplazar con imagen real de una casa o destino único */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-2xl shadow-xl">
          <h1 className="text-4xl md:text-6xl font-bold text-airbnb-text-100 mb-6 leading-tight">
            Book unique homes and experience
          </h1>

          <p className="text-lg md:text-xl text-airbnb-text-200 mb-6 leading-relaxed">
            Unforgettable travel experiences start with right now.
            Find adventures and new places with Airbnb.
            Rent unique places to stay from local hosts in 190+ countries.
          </p>

          <Link href="/properties">
            <Button
              size="lg"
              className="bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white font-semibold text-lg px-8 py-6 rounded-full transition-all hover:scale-105"
            >
              Explore destinations
            </Button>
          </Link>

          {/* Additional CTA */}
          <div className="mt-6 pt-6 border-t border-airbnb-bg-300/50">
            <p className="text-airbnb-text-200 mb-3">
              Earn money{' '}
              <span className="text-airbnb-primary-100 font-semibold">renting</span>{' '}
              on Airbnb
            </p>
            <Link
              href="/properties/create"
              className="text-airbnb-accent-100 font-medium hover:text-airbnb-accent-200 transition-colors inline-flex items-center gap-2"
            >
              Learn more
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
