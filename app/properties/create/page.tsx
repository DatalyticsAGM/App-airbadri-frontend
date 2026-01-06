/**
 * Create Property Page
 * 
 * Página para crear una nueva propiedad
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CreatePropertyForm } from '@/components/properties/create-property-form';
import { useAuth } from '@/lib/auth/auth-context';

export default function CreatePropertyPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-airbnb-text-100 mb-2">
              Crear Nueva Propiedad
            </h1>
            <p className="text-lg text-airbnb-text-200">
              Comparte tu espacio con viajeros de todo el mundo
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <CreatePropertyForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

