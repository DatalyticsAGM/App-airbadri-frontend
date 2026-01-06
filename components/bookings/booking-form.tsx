/**
 * Booking Form Component
 * 
 * Formulario para realizar una reserva de una propiedad
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';
import { mockBookings } from '@/lib/bookings/mock-bookings';
import { mockProperties } from '@/lib/properties/mock-properties';
import type { Property } from '@/lib/properties/types';
import { useRouter } from 'next/navigation';

const bookingSchema = z.object({
  checkIn: z.date({
    required_error: 'La fecha de entrada es requerida',
  }),
  checkOut: z.date({
    required_error: 'La fecha de salida es requerida',
  }),
  guests: z.number().min(1, 'Debe haber al menos un huésped'),
}).refine((data) => data.checkOut > data.checkIn, {
  message: 'La fecha de salida debe ser posterior a la de entrada',
  path: ['checkOut'],
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  property: Property;
}

export function BookingForm({ property }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<{ available: boolean } | null>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guests: 1,
    },
  });

  const checkIn = form.watch('checkIn');
  const checkOut = form.watch('checkOut');
  const guests = form.watch('guests');

  // Calcular precio total
  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * property.pricePerNight;
  };

  // Verificar disponibilidad cuando cambian las fechas
  useEffect(() => {
    if (checkIn && checkOut && checkOut > checkIn) {
      const checkAvailability = async () => {
        try {
          const result = await mockBookings.checkAvailability(
            property.id,
            checkIn.toISOString(),
            checkOut.toISOString()
          );
          setAvailability(result);
        } catch (err) {
          console.error('Error verificando disponibilidad:', err);
        }
      };
      checkAvailability();
    } else {
      setAvailability(null);
    }
  }, [checkIn, checkOut, property.id]);

  const onSubmit = async (values: BookingFormValues) => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (guests > property.maxGuests) {
        setError(`La propiedad solo acepta hasta ${property.maxGuests} huéspedes`);
        setIsLoading(false);
        return;
      }

      const booking = await mockBookings.createBooking(
        {
          propertyId: property.id,
          checkIn: values.checkIn.toISOString(),
          checkOut: values.checkOut.toISOString(),
          guests: values.guests,
        },
        user.id
      );

      router.push(`/bookings/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al realizar la reserva');
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = calculateTotal();
  const nights = checkIn && checkOut
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-airbnb-bg-300/30">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-airbnb-text-100">
            €{property.pricePerNight}
          </span>
          <span className="text-airbnb-text-200">noche</span>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {availability && !availability.available && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
            La propiedad no está disponible en estas fechas
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Entrada</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !checkIn && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, 'PPP', { locale: es }) : 'Selecciona fecha'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={(date) => form.setValue('checkIn', date || new Date())}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.checkIn && (
              <p className="text-xs text-red-500">{form.formState.errors.checkIn.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Salida</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !checkOut && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, 'PPP', { locale: es }) : 'Selecciona fecha'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={(date) => form.setValue('checkOut', date || new Date())}
                  disabled={(date) => date < new Date() || (checkIn ? date <= checkIn : false)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.checkOut && (
              <p className="text-xs text-red-500">{form.formState.errors.checkOut.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Huéspedes</Label>
          <Input
            type="number"
            min={1}
            max={property.maxGuests}
            {...form.register('guests', { valueAsNumber: true })}
            onChange={(e) => form.setValue('guests', parseInt(e.target.value) || 1)}
          />
          <p className="text-xs text-airbnb-text-200">
            Máximo {property.maxGuests} huéspedes
          </p>
          {form.formState.errors.guests && (
            <p className="text-xs text-red-500">{form.formState.errors.guests.message}</p>
          )}
        </div>

        {totalPrice > 0 && (
          <div className="border-t border-airbnb-bg-300 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-airbnb-text-200">
                €{property.pricePerNight} × {nights} {nights === 1 ? 'noche' : 'noches'}
              </span>
              <span className="text-airbnb-text-100">€{totalPrice}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-airbnb-bg-300">
              <span className="text-airbnb-text-100">Total</span>
              <span className="text-airbnb-text-100">€{totalPrice}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white"
          disabled={isLoading || !availability?.available || totalPrice === 0}
        >
          {isLoading ? 'Reservando...' : isAuthenticated ? 'Reservar' : 'Inicia sesión para reservar'}
        </Button>
      </form>
    </div>
  );
}

