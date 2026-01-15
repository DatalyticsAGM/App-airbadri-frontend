/**
 * Forgot Password Form Component
 * 
 * Formulario para solicitar recuperación de contraseña
 * 
 * Características:
 * - Validación de email
 * - Manejo de errores
 * - Estados de carga
 * - Mensaje de éxito
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Esquema de validación con Zod
const forgotPasswordSchema = z.object({
  email: z.string().email('El email no es válido').min(1, 'El email es requerido'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { forgotPassword } = useAuth();

  // Configuración del formulario con react-hook-form
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  /**
   * Maneja el submit del formulario
   */
  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await forgotPassword(values.email);
      
      if (result.success) {
        setSuccess(true);
        form.reset();
      } else {
        setError(result.error || 'Error al solicitar recuperación de contraseña');
      }
    } catch (err) {
      setError('Error al solicitar recuperación de contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Mensaje de éxito */}
        {success && (
          <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
            Si el email existe, recibirás instrucciones para resetear tu contraseña.
            <br />
            <span className="text-xs text-green-500 mt-1 block">
              (En desarrollo: revisa la consola del navegador para el token)
            </span>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Campo Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  disabled={isLoading || success}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón de submit */}
        <Button
          type="submit"
          className="w-full bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white"
          disabled={isLoading || success}
        >
          {isLoading ? 'Enviando...' : success ? 'Enviado ✓' : 'Enviar instrucciones'}
        </Button>
      </form>
    </Form>
  );
}







