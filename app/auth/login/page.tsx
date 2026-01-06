/**
 * Login Page
 * 
 * Página de inicio de sesión
 * 
 * Ruta: /auth/login
 */

import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { Home } from 'lucide-react';

export default function LoginPage() {
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
                Bienvenido de vuelta
              </h1>
              <p className="text-airbnb-text-200">
                Inicia sesión en tu cuenta de Airbnb
              </p>
            </div>

            <LoginForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-airbnb-text-200">
                ¿No tienes una cuenta?{' '}
                <Link
                  href="/auth/signup"
                  className="text-airbnb-primary-100 hover:text-airbnb-primary-100/80 font-medium"
                >
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


