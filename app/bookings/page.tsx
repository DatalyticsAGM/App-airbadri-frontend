/**
 * My Bookings Page
 * 
 * Página para ver y gestionar las reservas del usuario actual
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { mockBookings } from '@/lib/bookings/mock-bookings';
import { mockProperties } from '@/lib/properties/mock-properties';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, X } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Booking } from '@/lib/bookings/types';
import type { Property } from '@/lib/properties/types';

type BookingWithProperty = Booking & { property: Property | null };

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
};

export default function MyBookingsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadBookings = async () => {
      if (!user) return;

      try {
        const userBookings = await mockBookings.getBookingsByUser(user.id);
        
        // Cargar información de propiedades
        const bookingsWithProperties = await Promise.all(
          userBookings.map(async (booking) => {
            const property = await mockProperties.getPropertyById(booking.propertyId);
            return { ...booking, property };
          })
        );

        setBookings(bookingsWithProperties);
      } catch (error) {
        console.error('Error cargando reservas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      loadBookings();
    }
  }, [isAuthenticated, authLoading, user, router]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }

    try {
      await mockBookings.cancelBooking(bookingId);
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      ));
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      alert(error instanceof Error ? error.message : 'Error al cancelar la reserva');
    }
  };

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === statusFilter);

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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-airbnb-text-100 mb-2">
              Mis Reservas
            </h1>
            <p className="text-lg text-airbnb-text-200">
              Gestiona todas tus reservas
            </p>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('confirmed')}
            >
              Confirmadas
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('pending')}
            >
              Pendientes
            </Button>
            <Button
              variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('cancelled')}
            >
              Canceladas
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('completed')}
            >
              Completadas
            </Button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Calendar className="w-16 h-16 text-airbnb-text-200 mx-auto mb-4" />
              <p className="text-lg text-airbnb-text-200 mb-6">
                {statusFilter === 'all' 
                  ? 'Aún no has realizado ninguna reserva'
                  : `No tienes reservas ${statusLabels[statusFilter].toLowerCase()}`
                }
              </p>
              <Link href="/properties">
                <Button className="bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white">
                  Explorar Propiedades
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-md p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {booking.property && (
                      <div className="flex-shrink-0">
                        <img
                          src={booking.property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
                          alt={booking.property.title}
                          className="w-full md:w-48 h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-airbnb-text-100 mb-2">
                            {booking.property?.title || 'Propiedad eliminada'}
                          </h3>
                          <p className="text-airbnb-text-200 mb-2">
                            {booking.property?.location.city}, {booking.property?.location.country}
                          </p>
                        </div>
                        <Badge className={statusColors[booking.status]}>
                          {statusLabels[booking.status]}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-airbnb-text-200 mb-1">Check-in</p>
                          <p className="font-semibold text-airbnb-text-100">
                            {format(new Date(booking.checkIn), 'PPP', { locale: es })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-airbnb-text-200 mb-1">Check-out</p>
                          <p className="font-semibold text-airbnb-text-100">
                            {format(new Date(booking.checkOut), 'PPP', { locale: es })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-airbnb-text-200 mb-1">Huéspedes</p>
                          <p className="font-semibold text-airbnb-text-100">{booking.guests}</p>
                        </div>
                        <div>
                          <p className="text-sm text-airbnb-text-200 mb-1">Total</p>
                          <p className="font-semibold text-airbnb-text-100">€{booking.totalPrice}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link href={`/bookings/detail?id=${booking.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </Link>
                        {booking.property && (
                          <Link href={`/properties/${booking.property.id}`}>
                            <Button variant="outline" size="sm">
                              Ver Propiedad
                            </Button>
                          </Link>
                        )}
                        {(booking.status === 'confirmed' || booking.status === 'pending') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(booking.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                          </Button>
                        )}
                      </div>
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

