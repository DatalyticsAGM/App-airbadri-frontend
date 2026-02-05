/**
 * Configuration
 * 
 * Configuración centralizada de la aplicación.
 * Lee variables de entorno y proporciona valores por defecto.
 */

/**
 * Configuración de la aplicación
 */
export const config = {
  // API
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api',

  // App
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Airbnb Clone',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Features
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enableErrorTracking: process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === 'true',

  // Analytics (opcional)
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',

  // Error Tracking (opcional)
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

/**
 * Valida que las variables de entorno requeridas estén presentes
 */
export function validateConfig(): void {
  const errors: string[] = [];

  // En producción, validar que la API URL esté configurada
  if (config.isProduction && !config.apiUrl) {
    errors.push('NEXT_PUBLIC_API_URL is required');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join('\n')}`);
  }
}

// Validar configuración al cargar el módulo (solo en runtime, no en build)
if (typeof window !== 'undefined' && config.isProduction) {
  try {
    validateConfig();
  } catch (error) {
    console.error(error);
  }
}







