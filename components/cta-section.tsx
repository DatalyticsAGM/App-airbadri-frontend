/**
 * CTA Section Component
 *
 * Call-to-action final para convertir visitantes
 * Sección con background colorido y botones destacados
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-airbnb-primary-300 via-white to-airbnb-accent-100/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-airbnb-text-100 mb-6">
          Ready to start your adventure?
        </h2>
        <p className="text-lg md:text-xl text-airbnb-text-200 mb-10 max-w-3xl mx-auto leading-relaxed">
          Join millions of travelers who trust Airbnb for their unique stays.
          Start exploring destinations and book your perfect getaway today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/properties">
            <Button
              size="lg"
              className="bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white font-semibold text-lg px-10 py-6 rounded-full transition-all hover:scale-105 shadow-lg"
            >
              Browse homes
            </Button>
          </Link>
          <Link href="/properties/create">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-airbnb-accent-100 text-airbnb-accent-100 hover:bg-airbnb-accent-100 hover:text-white font-semibold text-lg px-10 py-6 rounded-full transition-all"
            >
              Become a host
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        {/* TODO: Reemplazar con datos reales de la base de datos */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-airbnb-primary-100 mb-2">
              4M+
            </p>
            <p className="text-airbnb-text-200 font-medium">Hosts</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-airbnb-primary-100 mb-2">
              220+
            </p>
            <p className="text-airbnb-text-200 font-medium">Countries</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-airbnb-primary-100 mb-2">
              1B+
            </p>
            <p className="text-airbnb-text-200 font-medium">Guest arrivals</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-airbnb-primary-100 mb-2">
              5.0
            </p>
            <p className="text-airbnb-text-200 font-medium">Average rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
