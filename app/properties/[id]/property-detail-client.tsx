/**
 * Property Detail Page Client Component
 * 
 * Componente cliente para la página de detalle de propiedad
 * Separado del Server Component para permitir generateStaticParams
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PropertyDetail } from '@/components/properties';
import { BookingForm } from '@/components/bookings';
import { getPropertyService } from '@/lib/api/service-factory';
import type { Property } from '@/lib/properties/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function PropertyDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const propertyService = getPropertyService();

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const id = params.id as string;
        const prop = await propertyService.getPropertyById(id);
        if (!prop) {
          router.push('/properties');
          return;
        }
        setProperty(prop);
      } catch (error) {
        console.error('Error cargando propiedad:', error);
        router.push('/properties');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProperty();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-airbnb-text-200">Cargando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/properties">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al catálogo
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenido principal */}
            <div className="lg:col-span-2">
              <PropertyDetail property={property} />
            </div>

            {/* Sidebar con formulario de reserva */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BookingForm property={property} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}





