/**
 * Forgot Password Page
 * 
 * Página para solicitar recuperación de contraseña
 * 
 * Ruta: /auth/forgot-password
 */

import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { Home } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      {/* Header simplificado */}
      <header className="border-b border-airbnb-bg-300/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-8 h-8 text-airbnb-primary-100" strokeWidth={2.5} />
              <span className="text-2xl font-bold text-airbnb-primary-100">airbnb</span>
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
                Recuperar contraseña
              </h1>
              <p className="text-airbnb-text-200">
                Ingresa tu email y te enviaremos instrucciones para resetear tu contraseña
              </p>
            </div>

            <ForgotPasswordForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-airbnb-text-200">
                ¿Recordaste tu contraseña?{' '}
                <Link
                  href="/auth/login"
                  className="text-airbnb-primary-100 hover:text-airbnb-primary-100/80 font-medium"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


