/**
 * Header Component
 *
 * Navigation bar con logo de Airbnb y enlaces principales
 * Diseño minimalista y responsivo
 * 
 * Actualizado: Integrado con AuthButton para mostrar estado de autenticación
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Heart } from 'lucide-react';
import Link from 'next/link';
import { AuthButton } from '@/components/auth';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { SearchInput, SearchHistoryComponent } from '@/components/search';
import { useAuth } from '@/lib/auth/auth-context';
import type { SearchSuggestion } from '@/lib/search/types';

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Maneja la búsqueda desde el header
   * Redirige a la página de propiedades con la búsqueda
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Si no estamos en la página de propiedades, redirigir allí
    if (pathname !== '/properties') {
      router.push(`/properties?search=${encodeURIComponent(query)}`);
    } else {
      // Si ya estamos en propiedades, disparar evento para actualizar la búsqueda
      window.dispatchEvent(new CustomEvent('header-search', { detail: { query } }));
    }
  }, [router, pathname]);

  /**
   * Maneja la selección de una sugerencia
   */
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    if (suggestion.type === 'property' && suggestion.propertyId) {
      // Redirigir a la página de detalle de la propiedad
      router.push(`/properties/${suggestion.propertyId}`);
    } else {
      // Usar el texto de la sugerencia como búsqueda
      handleSearch(suggestion.text);
    }
  }, [router, handleSearch]);

  return (
    <header className="bg-airbnb-bg-100 border-b border-airbnb-bg-300/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Home className="w-8 h-8 text-airbnb-primary-100" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-airbnb-primary-100 hidden sm:inline">airbnb</span>
          </Link>

          {/* Barra de búsqueda - Visible en desktop y tablet */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="w-full">
              <SearchInput
                onSearch={handleSearch}
                onSuggestionSelect={handleSuggestionSelect}
                placeholder="Buscar propiedades..."
                initialValue={searchQuery}
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 flex-shrink-0">
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
            {isAuthenticated && (
              <Link
                href="/favorites"
                className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors font-medium flex items-center gap-1"
              >
                <Heart className="w-4 h-4" />
                Favoritos
              </Link>
            )}
          </nav>

          {/* Notifications and Auth Button */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            {isAuthenticated && (
              <>
                <div className="hidden md:block">
                  <SearchHistoryComponent
                    onSelectSearch={(query) => handleSearch(query)}
                  />
                </div>
                <NotificationBell />
              </>
            )}
            <AuthButton />
          </div>

          {/* Mobile Search Button - Solo icono en mobile */}
          <Link
            href="/properties"
            className="md:hidden text-airbnb-text-100 hover:text-airbnb-primary-100"
            aria-label="Buscar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
