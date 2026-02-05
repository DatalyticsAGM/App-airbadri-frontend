/**
 * My Properties Page
 * 
 * Página para ver y gestionar las propiedades del usuario actual
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PropertyGrid } from '@/components/properties';
import { getPropertyService } from '@/lib/api/service-factory';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Property } from '@/lib/properties/types';

export default function MyPropertiesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const propertyService = getPropertyService();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadProperties = async () => {
      if (!user) return;

      try {
        const userProperties = await propertyService.getPropertiesByHost(user.id);
        setProperties(userProperties);
      } catch (error) {
        console.error('Error cargando propiedades:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      loadProperties();
    }
  }, [isAuthenticated, authLoading, user, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      return;
    }

    try {
      await propertyService.deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error eliminando propiedad:', error);
      alert('Error al eliminar la propiedad');
    }
  };

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-airbnb-text-100 mb-2">
                Mis Propiedades
              </h1>
              <p className="text-lg text-airbnb-text-200">
                Gestiona tus propiedades y reservas
              </p>
            </div>
            <Link href="/properties/create">
              <Button className="bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Crear Propiedad
              </Button>
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-lg text-airbnb-text-200 mb-6">
                Aún no has creado ninguna propiedad
              </p>
              <Link href="/properties/create">
                <Button className="bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear tu Primera Propiedad
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
                      alt={property.title}
                      className="w-full md:w-48 h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-airbnb-text-100 mb-2">
                      {property.title}
                    </h3>
                    <p className="text-airbnb-text-200 mb-4 line-clamp-2">
                      {property.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-airbnb-text-200 mb-4">
                      <span>{property.location.city}, {property.location.country}</span>
                      <span>€{property.pricePerNight}/noche</span>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/properties/${property.id}`}>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </Link>
                      <Link href={`/properties/${property.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

