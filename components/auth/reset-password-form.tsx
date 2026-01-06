/**
 * Reset Password Form Component
 * 
 * Formulario para resetear contraseña con token
 * 
 * Características:
 * - Validación de contraseña y confirmación
 * - Manejo de errores
 * - Estados de carga
 * - Mensaje de éxito
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
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
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  // Configuración del formulario con react-hook-form
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  /**
   * Maneja el submit del formulario
   */
  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await resetPassword(token, values.password);
      
      if (result.success) {
        setSuccess(true);
        // Redireccionar a login después de 2 segundos
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(result.error || 'Error al resetear contraseña');
      }
    } catch (err) {
      setError('Error al resetear contraseña');
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
            Contraseña actualizada correctamente. Redirigiendo...
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Campo Nueva Contraseña */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  disabled={isLoading || success}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Confirmar Contraseña */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nueva contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
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
          {isLoading ? 'Actualizando...' : success ? 'Actualizada ✓' : 'Actualizar contraseña'}
        </Button>
      </form>
    </Form>
  );
}


