/**
 * Header Component
 *
 * Navigation bar con logo de Airbnb y enlaces principales
 * Diseño minimalista y responsivo
 * 
 * Actualizado: Integrado con AuthButton para mostrar estado de autenticación
 */

import { Home } from 'lucide-react';
import Link from 'next/link';
import { AuthButton } from '@/components/auth/auth-button';

export function Header() {
  return (
    <header className="bg-airbnb-bg-100 border-b border-airbnb-bg-300/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-8 h-8 text-airbnb-primary-100" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-airbnb-primary-100">airbnb</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/properties"
              className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors font-medium"
            >
              Explorar
            </Link>
            <Link
              href="/properties/create"
              className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors font-medium"
            >
              Become a host
            </Link>
            <Link
              href="/about"
              className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors font-medium"
            >
              Help
            </Link>
          </nav>

          {/* Auth Button - Muestra estado de autenticación */}
          <div className="flex items-center">
            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          {/* FIXME: Implementar menu hamburguesa para mobile cuando sea necesario */}
          <button className="md:hidden text-airbnb-text-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
