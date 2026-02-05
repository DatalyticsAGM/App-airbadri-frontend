/**
 * Utilidades de autenticación
 * 
 * Funciones auxiliares para manejar tokens y validaciones de sesión.
 */

/**
 * Verifica si existe un token de autenticación almacenado
 * 
 * ¿Por qué existe esta función?
 * Para evitar llamadas innecesarias al API cuando sabemos que el usuario no está autenticado.
 * Esto mejora el rendimiento y evita errores 401 en la consola.
 * 
 * @returns true si existe un token, false en caso contrario
 */
export function hasAuthToken(): boolean {
  // Verificar que estamos en el navegador (no en SSR)
  if (typeof window === 'undefined') {
    return false;
  }

  // Verificar en localStorage
  try {
    const localToken = localStorage.getItem('auth_token');
    if (localToken) {
      return true;
    }
  } catch (error) {
    // localStorage puede no estar disponible en algunos contextos
  }

  // Verificar en sessionStorage
  try {
    const sessionToken = sessionStorage.getItem('auth_token');
    if (sessionToken) {
      return true;
    }
  } catch (error) {
    // sessionStorage puede no estar disponible en algunos contextos
  }

  // Verificar en cookies
  if (typeof document !== 'undefined') {
    const hasCookie = document.cookie.split(';').some((cookie) => {
      return cookie.trim().startsWith('auth_token=');
    });
    if (hasCookie) {
      return true;
    }
  }

  return false;
}

/**
 * Limpia el token de autenticación de todos los lugares de almacenamiento
 * 
 * Útil durante el logout para asegurar que no queden tokens residuales.
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem('auth_token');
  } catch (error) {
    // Ignorar errores
  }

  try {
    sessionStorage.removeItem('auth_token');
  } catch (error) {
    // Ignorar errores
  }

  // Limpiar cookie (si existe)
  if (typeof document !== 'undefined') {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
