/**
 * Header Component
 *
 * Componente de navegación principal de la aplicación.
 * Muestra el logo, enlaces de navegación y el botón de autenticación.
 *
 * ¿Qué hace este componente?
 * - Muestra el logo de la aplicación que lleva al inicio
 * - Muestra los enlaces principales de navegación (Explorar, Become a host, Help)
 * - Muestra el botón de autenticación que cambia según si el usuario está logueado o no
 * - Es responsive: en móvil oculta los enlaces de navegación
 *
 * ¿Por qué existe?
 * - Proporciona navegación consistente en toda la aplicación
 * - Permite a los usuarios acceder rápidamente a las secciones principales
 * - Muestra el estado de autenticación del usuario
 */

'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthButton } from '@/components/auth/auth-button';

// Array de enlaces de navegación
// Esto facilita agregar o modificar enlaces en el futuro
// Cada objeto tiene la ruta (href) y el texto que se muestra (label)
const navigationLinks = [
  {
    href: '/properties',
    label: 'Explorar',
  },
  {
    href: '/properties/create',
    label: 'Become a host',
  },
  {
    href: '/about',
    label: 'Help',
  },
];

/**
 * Componente Header
 *
 * Renderiza la barra de navegación principal de la aplicación.
 * Usa usePathname para detectar la ruta actual y resaltar el enlace activo.
 */
export function Header() {
  // Obtener la ruta actual para resaltar el enlace activo
  // usePathname es un hook de Next.js que nos da la ruta actual
  const pathname = usePathname();

  return (
    <header 
      className="bg-airbnb-bg-100 border-b border-airbnb-bg-300/30"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Enlace al inicio de la aplicación */}
          <Link 
            href="/" 
            className="flex items-center gap-2"
            aria-label="Ir al inicio de la aplicación"
          >
            <Home 
              className="w-8 h-8 text-airbnb-primary-100" 
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span className="text-2xl font-bold text-airbnb-primary-100">
              Adribnb
            </span>
          </Link>

          {/* Enlaces de navegación principal */}
          {/* role="navigation" ayuda a los lectores de pantalla a identificar esta sección */}
          <nav 
            className="hidden md:flex items-center gap-8"
            role="navigation"
            aria-label="Navegación principal"
          >
            {/* Recorremos el array de enlaces y creamos un Link para cada uno */}
            {navigationLinks.map((link) => {
              // Verificamos si la ruta actual coincide con el enlace
              // Esto nos permite resaltar el enlace de la página actual
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors font-medium ${
                    isActive
                      ? 'text-airbnb-primary-100'
                      : 'text-airbnb-text-200 hover:text-airbnb-primary-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Botón de autenticación */}
          {/* Muestra diferentes opciones según si el usuario está logueado o no */}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
