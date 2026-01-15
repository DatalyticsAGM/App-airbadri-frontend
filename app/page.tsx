/**
 * Home Page - Airbnb Promotional Landing Page
 *
 * Página principal con todas las secciones de la landing page
 * Diseño minimalista inspirado en Airbnb
 *
 * Secciones:
 * - Header: Navegación principal
 * - Hero: Sección destacada con llamada a la acción
 * - Features: Características del servicio
 * - Promotions: Ofertas especiales actuales
 * - CTA: Call-to-action final
 * - Footer: Enlaces y información adicional
 */

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';
import { PromotionsSection } from '@/components/promotions-section';
import { CTASection } from '@/components/cta-section';
import { TopbarOffers } from '@/components/topbar-offers';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* TODO: Agregar smooth scroll entre secciones si es necesario */}
      <TopbarOffers />
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PromotionsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
