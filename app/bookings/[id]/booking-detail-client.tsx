/**
 * Booking Detail Page Client Component
 * 
 * Componente cliente para la página de detalle de reserva
 * Separado del Server Component para permitir generateStaticParams
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { mockBookings } from '@/lib/bookings/mock-bookings';
import { mockProperties } from '@/lib/properties/mock-properties';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Users, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Booking } from '@/lib/bookings/types';
import type { Property } from '@/lib/properties/types';

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

export function BookingDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadBooking = async () => {
      try {
        // Obtener ID desde params (ruta dinámica) o desde query params (ruta estática)
        const id = (params.id as string) || searchParams.get('id');
        
        if (!id) {
          router.push('/bookings');
          return;
        }
        
        const bookingData = await mockBookings.getBookingById(id);

        if (!bookingData) {
          router.push('/bookings');
          return;
        }

        // Verificar que el usuario es el propietario de la reserva
        if (user && bookingData.userId !== user.id) {
          router.push('/bookings');
          return;
        }

        setBooking(bookingData);

        // Cargar información de la propiedad
        const propertyData = await mockProperties.getPropertyById(bookingData.propertyId);
        setProperty(propertyData);

        // Mostrar mensaje de éxito si viene del checkout
        if (searchParams.get('success') === 'true') {
          setShowSuccessMessage(true);
          toast({
            title: '¡Reserva confirmada exitosamente!',
            description: 'Tu reserva ha sido creada y confirmada. Puedes ver todos los detalles a continuación.',
            variant: 'default',
          });
          // Limpiar el parámetro success de la URL sin recargar
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.delete('success');
          window.history.replaceState({ ...window.history.state }, '', currentUrl.toString());
          // Ocultar el mensaje después de 5 segundos
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 5000);
        }
      } catch (error) {
        console.error('Error cargando reserva:', error);
        router.push('/bookings');
      } finally {
        setLoading(false);
      }
    };

    // Cargar si tenemos ID (desde params o query params) y el usuario está autenticado
    const id = (params.id as string) || searchParams.get('id');
    if (id && isAuthenticated && user) {
      loadBooking();
    }
  }, [params.id, isAuthenticated, authLoading, user, router, searchParams, toast]);

  const handleCancel = async () => {
    if (!booking) return;

    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }

    try {
      await mockBookings.cancelBooking(booking.id);
      setBooking({ ...booking, status: 'cancelled' });
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      alert(error instanceof Error ? error.message : 'Error al cancelar la reserva');
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

  if (!isAuthenticated || !booking) {
    return null;
  }

  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/bookings">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Mis Reservas
            </Button>
          </Link>

          {showSuccessMessage && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-2xl p-6 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-800 mb-1">
                  ¡Reserva confirmada exitosamente!
                </h3>
                <p className="text-green-700">
                  Tu reserva ha sido creada y confirmada. Puedes ver todos los detalles a continuación.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuccessMessage(false)}
                className="text-green-700 hover:text-green-800"
              >
                ✕
              </Button>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-airbnb-text-100">
                Detalle de Reserva
              </h1>
              <Badge className={statusColors[booking.status]}>
                {statusLabels[booking.status]}
              </Badge>
            </div>

            {property && (
              <div className="mb-8">
                <img
                  src={property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
                  alt={property.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-airbnb-text-100 mb-2">
                  {property.title}
                </h2>
                <div className="flex items-center gap-2 text-airbnb-text-200 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>
                    {property.location.address}, {property.location.city}, {property.location.country}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-airbnb-primary-100 mt-1" />
                <div>
                  <p className="text-sm text-airbnb-text-200 mb-1">Check-in</p>
                  <p className="font-semibold text-airbnb-text-100">
                    {format(new Date(booking.checkIn), 'PPP', { locale: es })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-airbnb-primary-100 mt-1" />
                <div>
                  <p className="text-sm text-airbnb-text-200 mb-1">Check-out</p>
                  <p className="font-semibold text-airbnb-text-100">
                    {format(new Date(booking.checkOut), 'PPP', { locale: es })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-airbnb-primary-100 mt-1" />
                <div>
                  <p className="text-sm text-airbnb-text-200 mb-1">Huéspedes</p>
                  <p className="font-semibold text-airbnb-text-100">{booking.guests}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-airbnb-text-200 mb-1">Noches</p>
                <p className="font-semibold text-airbnb-text-100">{nights}</p>
              </div>
            </div>

            <div className="border-t border-airbnb-bg-300 pt-6 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-airbnb-text-200">
                    Precio por noche
                  </span>
                  <span className="text-airbnb-text-100">
                    €{property ? property.pricePerNight : 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-airbnb-text-200">
                    {nights} {nights === 1 ? 'noche' : 'noches'}
                  </span>
                  <span className="text-airbnb-text-100">
                    €{booking.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-airbnb-bg-300">
                  <span className="text-airbnb-text-100">Total</span>
                  <span className="text-airbnb-text-100">€{booking.totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {property && (
                <Link href={`/properties/${property.id}`}>
                  <Button variant="outline">
                    Ver Propiedad
                  </Button>
                </Link>
              )}
              {(booking.status === 'confirmed' || booking.status === 'pending') && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="text-red-600 hover:text-red-700"
                >
                  Cancelar Reserva
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

