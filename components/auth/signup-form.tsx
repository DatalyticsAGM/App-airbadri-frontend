/**
 * Signup Form Component
 * 
 * Formulario de registro con validación usando react-hook-form y zod.
 * 
 * Características:
 * - Validación de todos los campos
 * - Validación de coincidencia de contraseñas
 * - Manejo de errores del servidor (MOCK)
 * - Estados de carga durante el submit
 * - Redirección automática después del registro exitoso
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

// Esquema de validación con Zod (incluye validación de coincidencia de contraseñas)
const signupSchema = z
  .object({
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('El email no es válido').min(1, 'El email es requerido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup } = useAuth();
  const router = useRouter();

  // Configuración del formulario con react-hook-form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  /**
   * Maneja el submit del formulario
   */
  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signup(values.email, values.password, values.fullName);
      
      if (result.success) {
        // Redireccionar a la página principal
        router.push('/');
        router.refresh();
      } else {
        // Mostrar error del servidor
        setError(result.error || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Mensaje de error general */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Campo Nombre completo */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Juan Pérez"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Contraseña */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Confirmar contraseña */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  disabled={isLoading}
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
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : 'Crear cuenta'}
        </Button>
      </form>
    </Form>
  );
}


