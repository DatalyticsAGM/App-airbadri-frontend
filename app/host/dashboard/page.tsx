/**
 * Host Dashboard Page
 * 
 * Dashboard para hosts con estadísticas y gestión
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useAuth } from '@/lib/auth/auth-context';
import { mockProperties } from '@/lib/properties/mock-properties';
import { mockBookings } from '@/lib/bookings/mock-bookings';
import { mockReviews } from '@/lib/reviews/mock-reviews';
import type { Property } from '@/lib/properties/types';
import { Home, Calendar, DollarSign, Star, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HostDashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    upcomingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user, authLoading, router]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Cargar propiedades del host
      const hostProperties = await mockProperties.getPropertiesByHost(user.id);
      setProperties(hostProperties);

      // Calcular estadísticas
      let totalBookings = 0;
      let totalRevenue = 0;
      let totalRating = 0;
      let ratingCount = 0;
      let upcomingCount = 0;

      for (const property of hostProperties) {
        const bookings = await mockBookings.getBookingsByProperty(property.id);
        totalBookings += bookings.length;

        bookings.forEach((booking) => {
          totalRevenue += booking.totalPrice;
          const checkIn = new Date(booking.checkIn);
          if (checkIn > new Date()) {
            upcomingCount++;
          }
        });

        const ratingData = await mockReviews.calculateAverageRating(property.id);
        if (ratingData.count > 0) {
          totalRating += ratingData.average;
          ratingCount++;
        }
      }

      setStats({
        totalProperties: hostProperties.length,
        totalBookings,
        totalRevenue,
        averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
        upcomingBookings: upcomingCount,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-airbnb-text-100 mb-2">
                Dashboard de Anfitrión
              </h1>
              <p className="text-lg text-airbnb-text-200">
                Gestiona tus propiedades y reservas
              </p>
            </div>
            <Link href="/properties/create">
              <Button className="bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Propiedad
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <Home className="w-8 h-8 text-airbnb-primary-100" />
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-airbnb-text-100 mb-1">
                {stats.totalProperties}
              </div>
              <div className="text-sm text-airbnb-text-200">Propiedades</div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-airbnb-accent-100" />
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-airbnb-text-100 mb-1">
                {stats.totalBookings}
              </div>
              <div className="text-sm text-airbnb-text-200">Reservas totales</div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-airbnb-text-100 mb-1">
                {stats.upcomingBookings}
              </div>
              <div className="text-sm text-airbnb-text-200">Próximas</div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-green-600" />
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-airbnb-text-100 mb-1">
                €{stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-airbnb-text-200">Ingresos totales</div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-airbnb-text-100 mb-1">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
              </div>
              <div className="text-sm text-airbnb-text-200">Rating promedio</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-airbnb-text-100 mb-4">
              Accesos Rápidos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/properties/my-properties">
                <div className="p-4 border border-airbnb-bg-300 rounded-lg hover:border-airbnb-primary-100 transition-colors cursor-pointer">
                  <Home className="w-6 h-6 text-airbnb-primary-100 mb-2" />
                  <h3 className="font-semibold text-airbnb-text-100 mb-1">
                    Mis Propiedades
                  </h3>
                  <p className="text-sm text-airbnb-text-200">
                    Gestiona todas tus propiedades
                  </p>
                </div>
              </Link>
              <Link href="/bookings">
                <div className="p-4 border border-airbnb-bg-300 rounded-lg hover:border-airbnb-primary-100 transition-colors cursor-pointer">
                  <Calendar className="w-6 h-6 text-airbnb-accent-100 mb-2" />
                  <h3 className="font-semibold text-airbnb-text-100 mb-1">
                    Mis Reservas
                  </h3>
                  <p className="text-sm text-airbnb-text-200">
                    Ver y gestionar reservas
                  </p>
                </div>
              </Link>
              <Link href="/properties/create">
                <div className="p-4 border border-airbnb-bg-300 rounded-lg hover:border-airbnb-primary-100 transition-colors cursor-pointer">
                  <Plus className="w-6 h-6 text-airbnb-primary-100 mb-2" />
                  <h3 className="font-semibold text-airbnb-text-100 mb-1">
                    Nueva Propiedad
                  </h3>
                  <p className="text-sm text-airbnb-text-200">
                    Agregar una nueva propiedad
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Properties */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-airbnb-text-100">
                Propiedades Recientes
              </h2>
              <Link href="/properties/my-properties">
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </Link>
            </div>
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-airbnb-bg-300 mx-auto mb-4" />
                <p className="text-airbnb-text-200 mb-4">
                  Aún no tienes propiedades
                </p>
                <Link href="/properties/create">
                  <Button className="bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primera Propiedad
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.slice(0, 5).map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="block p-4 border border-airbnb-bg-300 rounded-lg hover:border-airbnb-primary-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-airbnb-text-100 mb-1">
                          {property.title}
                        </h3>
                        <p className="text-sm text-airbnb-text-200">
                          {property.location.city}, {property.location.country}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-airbnb-text-100">
                          €{property.pricePerNight}/noche
                        </div>
                        <div className="text-sm text-airbnb-text-200">
                          {property.rating.toFixed(1)} ⭐ ({property.reviewCount})
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
