/**
 * Favorites Page
 * 
 * Página para ver todas las propiedades favoritas del usuario
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PropertyGrid } from '@/components/properties';
import { useAuth } from '@/lib/auth/auth-context';
import { favoritesService } from '@/lib/favorites/favorites-service';
import { getPropertyService } from '@/lib/api/service-factory';
import type { Property } from '@/lib/properties/types';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const propertyService = getPropertyService();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated && user) {
      loadFavorites();
    }
  }, [isAuthenticated, user, authLoading, router]);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const favoriteIds = await favoritesService.getFavoritePropertyIds(user.id);
      
      if (favoriteIds.length === 0) {
        setFavoriteProperties([]);
        return;
      }

      // Cargar propiedades favoritas
      const properties = await Promise.all(
        favoriteIds.map((id) => propertyService.getPropertyById(id))
      );

      setFavoriteProperties(properties.filter((p): p is Property => p !== null));
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-airbnb-primary-100 fill-airbnb-primary-100" />
              <h1 className="text-4xl font-bold text-airbnb-text-100">
                Mis Favoritos
              </h1>
            </div>
            <p className="text-lg text-airbnb-text-200">
              {favoriteProperties.length === 0
                ? 'Aún no has guardado ninguna propiedad en favoritos'
                : `${favoriteProperties.length} ${favoriteProperties.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'}`}
            </p>
          </div>

          {favoriteProperties.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-24 h-24 text-airbnb-bg-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-airbnb-text-100 mb-2">
                No tienes favoritos aún
              </h2>
              <p className="text-airbnb-text-200 mb-6">
                Explora propiedades y guarda tus favoritas para verlas después
              </p>
              <a
                href="/properties"
                className="inline-block bg-airbnb-primary-100 text-white px-6 py-3 rounded-lg font-semibold hover:bg-airbnb-primary-100/90 transition-colors"
              >
                Explorar Propiedades
              </a>
            </div>
          ) : (
            <PropertyGrid properties={favoriteProperties} loading={false} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}







