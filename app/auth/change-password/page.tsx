/**
 * Change Password Page
 *
 * Página para que un usuario autenticado cambie su contraseña.
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ChangePasswordForm } from '@/components/auth';
import { useAuth } from '@/lib/auth/auth-context';
import { Home } from 'lucide-react';

export default function ChangePasswordPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

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
                Cambiar contraseña
              </h1>
              <p className="text-airbnb-text-200">
                Actualiza tu contraseña de forma segura.
              </p>
            </div>

            {!loading && isAuthenticated && <ChangePasswordForm />}

            <div className="mt-6 text-center">
              <p className="text-sm text-airbnb-text-200">
                <Link
                  href="/profile"
                  className="text-airbnb-primary-100 hover:text-airbnb-primary-100/80 font-medium"
                >
                  Volver a mi perfil
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

