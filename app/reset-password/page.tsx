/**
 * Reset Password Page
 * 
 * Página para resetear contraseña usando token de recuperación.
 * Se conecta al backend (MongoDB) en puerto 3333 para actualizar la contraseña.
 * 
 * Ruta: /reset-password?token=...
 * 
 * ¿Por qué existe?
 * Permite a usuarios que olvidaron su contraseña establecer una nueva
 * usando un token de seguridad enviado por email.
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

/**
 * Esquema de validación para el formulario
 * 
 * ¿Por qué existe?
 * Valida que las contraseñas cumplan requisitos mínimos de seguridad
 * y que la confirmación coincida con la contraseña ingresada.
 */
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

/**
 * Componente del contenido de reset password
 * 
 * ¿Qué hace?
 * 1. Valida el token con el backend (MongoDB)
 * 2. Muestra el formulario si el token es válido
 * 3. Envía la nueva contraseña al backend para actualizar en MongoDB
 */
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { validateResetToken, resetPassword } = useAuth();

  // Obtener token de la URL
  const token = useMemo(() => searchParams.get('token'), [searchParams]);

  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Configurar formulario con validación
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  /**
   * Valida el token con el backend al cargar la página
   * 
   * ¿Por qué existe?
   * Para verificar que el token es válido antes de permitir
   * que el usuario ingrese una nueva contraseña.
   * Esto previene intentos de reseteo con tokens inválidos o expirados.
   */
  useEffect(() => {
    let cancelled = false;

    async function run() {
      setError(null);

      if (!token) {
        setValidating(false);
        setIsValid(false);
        return;
      }

      setValidating(true);
      
      try {
        // Llamar al backend para validar token
        // Backend verifica: GET /api/auth/reset-password/validate?token=...
        const result = await validateResetToken(token);

        if (cancelled) return;

        setIsValid(result.valid);
        setError(result.valid ? null : (result.message || 'Token no válido o expirado'));
      } catch (err) {
        if (!cancelled) {
          setError('Error al validar el token');
          setIsValid(false);
        }
      } finally {
        if (!cancelled) {
          setValidating(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token, validateResetToken]);

  /**
   * Maneja el submit del formulario
   * 
   * ¿Qué hace?
   * 1. Envía la nueva contraseña al backend (POST /api/auth/reset-password)
   * 2. El backend actualiza la contraseña en MongoDB
   * 3. Redirige al login si es exitoso
   */
  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Enviar nueva contraseña al backend
      // Backend: POST http://localhost:3333/api/auth/reset-password
      // Body: { token, password }
      // Backend actualiza en MongoDB
      const result = await resetPassword(token, values.password);
      
      if (result.success) {
        setSuccess(true);
        // Redirigir a login después de 2 segundos
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(result.error || 'Error al resetear contraseña');
      }
    } catch (err) {
      setError('Error al resetear contraseña. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Estado: Validando token
  if (validating) {
    return (
      <div className="p-4 text-sm text-airbnb-text-200 bg-airbnb-bg-200 border border-airbnb-bg-300 rounded-md">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-airbnb-primary-100"></div>
          <span>Validando token con el servidor...</span>
        </div>
      </div>
    );
  }

  // Estado: Token inválido o faltante
  if (!token || !isValid) {
    return (
      <>
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
          <p className="font-medium mb-1">Token inválido o expirado</p>
          <p className="text-xs">
            {error || 'El enlace de recuperación no es válido o ya expiró. Por favor, solicita un nuevo enlace.'}
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-airbnb-primary-100 hover:text-airbnb-primary-100/80 font-medium"
          >
            Solicitar nuevo enlace de recuperación
          </Link>
        </div>
      </>
    );
  }

  // Estado: Formulario para establecer nueva contraseña
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Mensaje de éxito */}
        {success && (
          <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
            <p className="font-medium">¡Contraseña actualizada correctamente!</p>
            <p className="text-xs mt-1">
              Tu contraseña ha sido guardada en la base de datos. Redirigiendo al login...
            </p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Información sobre la conexión */}
        <div className="p-3 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
          <p className="font-medium mb-1">🔒 Conexión segura</p>
          <p>
            Tu contraseña será encriptada y guardada en MongoDB (puerto 3333)
          </p>
        </div>

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
                  placeholder="Mínimo 6 caracteres"
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
                  placeholder="Repite tu contraseña"
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
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Actualizando en MongoDB...
            </span>
          ) : success ? (
            '✓ Contraseña actualizada'
          ) : (
            'Restablecer contraseña'
          )}
        </Button>
      </form>
    </Form>
  );
}

/**
 * Página principal de Reset Password
 */
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      {/* Header simplificado */}
      <header className="border-b border-airbnb-bg-300/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-8 h-8 text-airbnb-primary-100" strokeWidth={2.5} />
              <span className="text-2xl font-bold text-airbnb-primary-100">Adribnb</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-airbnb-text-100 mb-2">
                Restablecer contraseña
              </h1>
              <p className="text-airbnb-text-200">
                Ingresa tu nueva contraseña. Será guardada de forma segura en la base de datos.
              </p>
            </div>

            <ResetPasswordContent />

            <div className="mt-6 text-center">
              <p className="text-sm text-airbnb-text-200">
                <Link
                  href="/auth/login"
                  className="text-airbnb-primary-100 hover:text-airbnb-primary-100/80 font-medium"
                >
                  Volver al inicio de sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
