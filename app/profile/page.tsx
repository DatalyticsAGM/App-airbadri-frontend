/**
 * Profile Page
 * 
 * Página de perfil del usuario
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useAuth } from '@/lib/auth/auth-context';
import { mockBookings } from '@/lib/bookings/mock-bookings';
import { mockProperties } from '@/lib/properties/mock-properties';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Calendar, Settings } from 'lucide-react';
import { AvatarUpload } from '@/components/profile/avatar-upload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    propertiesCount: 0,
    bookingsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadStats = async () => {
      if (!user) return;

      try {
        const [properties, bookings] = await Promise.all([
          mockProperties.getPropertiesByHost(user.id),
          mockBookings.getBookingsByUser(user.id),
        ]);

        setStats({
          propertiesCount: properties.length,
          bookingsCount: bookings.length,
        });
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      loadStats();
    }
  }, [isAuthenticated, authLoading, user, router]);

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

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-airbnb-text-100 mb-2">
              Mi Perfil
            </h1>
            <p className="text-lg text-airbnb-text-200">
              Gestiona tu cuenta y actividades
            </p>
          </div>

          {/* User Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <AvatarUpload />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-airbnb-text-100 mb-1">
                    {user.fullName}
                  </h2>
                  <p className="text-airbnb-text-200">{user.email}</p>
                  <p className="text-sm text-airbnb-text-200 mt-1">
                    Miembro desde {new Date(user.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-airbnb-primary-100" />
                  Mis Propiedades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-airbnb-text-100 mb-2">
                  {stats.propertiesCount}
                </div>
                <p className="text-airbnb-text-200 mb-4">
                  {stats.propertiesCount === 1 ? 'propiedad creada' : 'propiedades creadas'}
                </p>
                <Link href="/properties/my-properties">
                  <Button variant="outline" className="w-full">
                    Gestionar Propiedades
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-airbnb-primary-100" />
                  Mis Reservas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-airbnb-text-100 mb-2">
                  {stats.bookingsCount}
                </div>
                <p className="text-airbnb-text-200 mb-4">
                  {stats.bookingsCount === 1 ? 'reserva realizada' : 'reservas realizadas'}
                </p>
                <Link href="/bookings">
                  <Button variant="outline" className="w-full">
                    Ver Reservas
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-airbnb-primary-100" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/properties/create">
                  <Button className="w-full bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white">
                    <Home className="w-4 h-4 mr-2" />
                    Crear Nueva Propiedad
                  </Button>
                </Link>
                <Link href="/properties">
                  <Button variant="outline" className="w-full">
                    Explorar Propiedades
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

