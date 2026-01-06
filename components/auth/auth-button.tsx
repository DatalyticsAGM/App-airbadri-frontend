/**
 * Auth Button Component
 * 
 * Componente que muestra el estado de autenticación en el header.
 * 
 * Estados:
 * - No autenticado: Muestra botones "Iniciar sesión" y "Registrarse"
 * - Autenticado: Muestra avatar con menú desplegable (perfil, configuración, logout)
 * - Cargando: Muestra skeleton mientras carga el estado
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Settings, Home, Calendar } from 'lucide-react';

export function AuthButton() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Estado de carga - mostrar skeleton
  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-20 h-10 bg-airbnb-bg-200 animate-pulse rounded-full" />
      </div>
    );
  }

  // Usuario autenticado - mostrar menú desplegable
  if (isAuthenticated && user) {
    // Obtener iniciales del nombre para el avatar
    const initials = user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 p-2 rounded-full hover:bg-airbnb-bg-200 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user.fullName} />
              <AvatarFallback className="bg-airbnb-primary-100 text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-airbnb-text-200">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Mi Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/bookings" className="flex items-center cursor-pointer">
              <Calendar className="mr-2 h-4 w-4" />
              Mis Reservas
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/properties/my-properties" className="flex items-center cursor-pointer">
              <Home className="mr-2 h-4 w-4" />
              Mis Propiedades
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-red-600 focus:text-red-600 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Usuario no autenticado - mostrar botones de login/signup
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        asChild
        className="text-airbnb-text-200 hover:text-airbnb-primary-100"
      >
        <Link href="/auth/login">Iniciar sesión</Link>
      </Button>
      <Button
        asChild
        className="bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white"
      >
        <Link href="/auth/signup">Registrarse</Link>
      </Button>
    </div>
  );
}


