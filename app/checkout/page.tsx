/**
 * Checkout Page
 * 
 * Página de checkout donde el usuario revisa y confirma su reserva.
 * Muestra resumen de propiedad, desglose de precios e información del usuario.
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PropertySummary, PricingBreakdownComponent, UserInfoSection } from '@/components/checkout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { getCheckoutData, validateCheckoutData, clearCheckoutTemp } from '@/lib/checkout/mock-checkout';
import { mockBookings } from '@/lib/bookings/mock-bookings';
import { useToast } from '@/hooks/use-toast';
import type { CheckoutData, CheckoutFormData } from '@/lib/checkout/types';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirigir a login si no está autenticado
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Cargar datos de checkout desde query params
    const loadCheckoutData = async () => {
      try {
        const propertyId = searchParams.get('propertyId');
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const guests = searchParams.get('guests');

        if (!propertyId || !checkIn || !checkOut || !guests) {
          setError('Faltan datos necesarios para el checkout');
          setLoading(false);
          return;
        }

        const data = await getCheckoutData(
          propertyId,
          checkIn,
          checkOut,
          parseInt(guests)
        );

        setCheckoutData(data);

        // Pre-llenar formulario con datos del usuario solo una vez
        if (user) {
          setFormData({
            fullName: user.name || '',
            email: user.email || '',
            phone: '',
          });
        }
      } catch (err) {
        console.error('Error cargando datos de checkout:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar datos de checkout');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user && !checkoutData && loading) {
      loadCheckoutData();
    }
  }, [isAuthenticated, authLoading, user, router, searchParams, checkoutData, loading]);

  // Memoizar la función onDataChange para evitar re-renders
  const handleDataChange = useCallback((data: CheckoutFormData) => {
    setFormData(data);
  }, []);

  /**
   * Maneja la confirmación de la reserva
   * 
   * Esta función valida todos los datos, crea la reserva usando el servicio MOCK
   * y redirige al usuario a la página de detalle de reserva.
   */
  const handleConfirmBooking = async () => {
    if (!checkoutData || !formData || !user) {
      setError('Faltan datos para confirmar la reserva');
      return;
    }

    // Validar datos del formulario
    const validation = validateCheckoutData(formData);
    if (!validation.valid) {
      setError(validation.error || 'Datos inválidos');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Crear la reserva usando el servicio MOCK
      const booking = await mockBookings.createBooking(
        {
          propertyId: checkoutData.property.id,
          checkIn: checkoutData.checkIn,
          checkOut: checkoutData.checkOut,
          guests: checkoutData.guests,
        },
        user.id
      );

      // Limpiar datos temporales
      clearCheckoutTemp();

      // Mostrar mensaje de éxito
      toast({
        title: '¡Reserva confirmada!',
        description: 'Tu reserva se ha realizado correctamente. Redirigiendo...',
        variant: 'default',
      });

      // Esperar un momento para que el usuario vea el mensaje antes de redirigir
      // Usar ruta estática con query params para funcionar con output: export
      setTimeout(() => {
        router.push(`/bookings/detail?id=${booking.id}&success=true`);
      }, 1500);
    } catch (err) {
      console.error('Error confirmando reserva:', err);
      setError(err instanceof Error ? err.message : 'Error al confirmar la reserva');
      setSubmitting(false);
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

  if (error && !checkoutData) {
    return (
      <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Link href="/properties">
                <Button>Volver a Propiedades</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!checkoutData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href={`/properties/${checkoutData.property.id}`}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la Propiedad
            </Button>
          </Link>

          <h1 className="text-4xl font-bold text-airbnb-text-100 mb-8">
            Completa tu Reserva
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal - Información y formulario */}
            <div className="lg:col-span-2 space-y-6">
              <UserInfoSection
                initialData={formData || undefined}
                onDataChange={handleDataChange}
              />
            </div>

            {/* Columna lateral - Resumen */}
            <div className="lg:col-span-1 space-y-6">
              <PropertySummary
                property={checkoutData.property}
                checkIn={checkoutData.checkIn}
                checkOut={checkoutData.checkOut}
                guests={checkoutData.guests}
                nights={checkoutData.pricing.nights}
              />

              <PricingBreakdownComponent pricing={checkoutData.pricing} />

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-airbnb-bg-300/30">
                <Button
                  onClick={handleConfirmBooking}
                  disabled={submitting || !formData}
                  className="w-full bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white text-lg py-6"
                >
                  {submitting ? 'Confirmando...' : 'Confirmar Reserva'}
                </Button>
                <p className="text-xs text-airbnb-text-200 text-center mt-3">
                  Al confirmar, aceptas nuestros términos y condiciones
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

