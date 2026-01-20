/**
 * Global Error Boundary
 * 
 * Componente de error global para Next.js App Router
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-airbnb-text-100 mb-4">
          Algo salió mal
        </h1>
        <p className="text-airbnb-text-200 mb-6">
          Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>
        {error.message && (
          <p className="text-sm text-red-600 mb-6 bg-red-50 p-3 rounded">
            {error.message}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white"
          >
            Intentar de nuevo
          </Button>
          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Ir al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}





