/**
 * Debug Init Page
 * 
 * Página de utilidad.
 *
 * Nota: esta pantalla existía para inicializar datos locales. Al usar API real,
 * la inicialización se hace en el backend, así que aquí solo dejamos un aviso.
 */

'use client';

export default function DebugInitPage() {
  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-airbnb-text-100 mb-6">
          Debug (API real)
        </h1>
        
        <div className="space-y-4 mb-6">
          <p className="text-airbnb-text-200">
            Esta app ahora está configurada para consumir la API real.
          </p>
          
          <div className="bg-airbnb-bg-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-airbnb-text-100 mb-2">
              ¿Qué hacer ahora?
            </p>
            <p className="text-sm text-airbnb-text-200">
              Inicializa datos en el backend (seed) y usa los endpoints reales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

