/**
 * Reset Password Page
 * 
 * Página para resetear contraseña con token
 * 
 * Ruta: /auth/reset-password?token=...
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/components/auth';
import { Home } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const { validateResetToken } = useAuth();

  const token = useMemo(() => searchParams.get('token'), [searchParams]);

  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const result = await validateResetToken(token);

      if (cancelled) return;

      setIsValid(result.valid);
      setError(result.valid ? null : (result.message || 'Token no válido o expirado'));
      setValidating(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token, validateResetToken]);

  if (validating) {
    return (
      <div className="p-3 text-sm text-airbnb-text-200 bg-airbnb-bg-200 border border-airbnb-bg-300 rounded-md">
        Validando token...
      </div>
    );
  }

  if (!token || !isValid) {
    return (
      <>
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
          {error || 'Token no válido. Por favor, solicita un nuevo enlace de recuperación.'}
        </div>
        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-airbnb-primary-100 hover:text-airbnb-primary-100/80 font-medium"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </>
    );
  }

  return <ResetPasswordForm token={token} />;
}

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
                Nueva contraseña
              </h1>
              <p className="text-airbnb-text-200">
                Ingresa tu nueva contraseña
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


