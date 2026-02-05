/**
 * Edit Property Page
 * 
 * Página para editar una propiedad existente
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { EditPropertyForm } from '@/components/properties';
import { getPropertyService } from '@/lib/api/service-factory';
import { useAuth } from '@/lib/auth/auth-context';
import type { Property } from '@/lib/properties/types';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const propertyService = getPropertyService();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadProperty = async () => {
      try {
        const id = params.id as string;
        const prop = await propertyService.getPropertyById(id);
        
        if (!prop) {
          router.push('/properties');
          return;
        }

        // Verificar que el usuario es el propietario
        if (user && prop.hostId !== user.id) {
          router.push(`/properties/${id}`);
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

    if (params.id && isAuthenticated) {
      loadProperty();
    }
  }, [params.id, isAuthenticated, authLoading, user, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-airbnb-text-200">Cargando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-airbnb-text-100 mb-2">
              Editar Propiedad
            </h1>
            <p className="text-lg text-airbnb-text-200">
              Actualiza la información de tu propiedad
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <EditPropertyForm property={property} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

