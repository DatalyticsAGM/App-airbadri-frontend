/**
 * Debug Init Page
 * 
 * Página de utilidad para forzar la inicialización de datos de ejemplo
 * Útil para desarrollo y debugging
 */

'use client';

import { useState } from 'react';
import { initializeMockUsers } from '@/lib/auth/mock-users-data';
import { initializeMockProperties } from '@/lib/properties/mock-data';
import { initializeMockBookings } from '@/lib/bookings/mock-data';
import { Button } from '@/components/ui/button';

export default function DebugInitPage() {
  const [status, setStatus] = useState<string>('');

  const handleInit = () => {
    try {
      setStatus('Inicializando...');
      
      // Limpiar datos existentes
      localStorage.removeItem('airbnb_mock_users');
      localStorage.removeItem('airbnb_mock_properties');
      localStorage.removeItem('airbnb_mock_bookings');
      localStorage.removeItem('airbnb_mock_sessions');
      
      // Inicializar datos
      initializeMockUsers();
      initializeMockProperties();
      initializeMockBookings();
      
      setStatus('✅ Datos inicializados correctamente. Recarga la página.');
      
      // Mostrar datos en consola
      const users = JSON.parse(localStorage.getItem('airbnb_mock_users') || '[]');
      const properties = JSON.parse(localStorage.getItem('airbnb_mock_properties') || '[]');
      const bookings = JSON.parse(localStorage.getItem('airbnb_mock_bookings') || '[]');
      
      console.log('Usuarios:', users);
      console.log('Propiedades:', properties);
      console.log('Reservas:', bookings);
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
      console.error(error);
    }
  };

  const handleShowData = () => {
    const users = JSON.parse(localStorage.getItem('airbnb_mock_users') || '[]');
    const properties = JSON.parse(localStorage.getItem('airbnb_mock_properties') || '[]');
    const bookings = JSON.parse(localStorage.getItem('airbnb_mock_bookings') || '[]');
    
    console.log('=== DATOS EN LOCALSTORAGE ===');
    console.log('Usuarios:', users);
    console.log('Propiedades:', properties);
    console.log('Reservas:', bookings);
    
    setStatus('Datos mostrados en consola (F12)');
  };

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-airbnb-text-100 mb-6">
          Inicialización de Datos de Prueba
        </h1>
        
        <div className="space-y-4 mb-6">
          <p className="text-airbnb-text-200">
            Esta página te permite forzar la inicialización de usuarios, propiedades y reservas de ejemplo.
          </p>
          
          <div className="bg-airbnb-bg-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-airbnb-text-100 mb-2">Usuarios de prueba:</p>
            <ul className="text-sm text-airbnb-text-200 space-y-1">
              <li>• host@example.com / host123</li>
              <li>• guest@example.com / guest123</li>
              <li>• test@example.com / test123</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleInit}
            className="w-full bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white"
          >
            Inicializar Datos (Limpia y Crea Todo)
          </Button>
          
          <Button
            onClick={handleShowData}
            variant="outline"
            className="w-full"
          >
            Mostrar Datos en Consola
          </Button>
        </div>

        {status && (
          <div className={`mt-6 p-4 rounded-lg ${
            status.includes('✅') 
              ? 'bg-green-50 text-green-800' 
              : status.includes('❌')
              ? 'bg-red-50 text-red-800'
              : 'bg-blue-50 text-blue-800'
          }`}>
            {status}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-airbnb-bg-300">
          <p className="text-xs text-airbnb-text-200">
            Después de inicializar, ve a <code className="bg-airbnb-bg-200 px-1 rounded">/auth/login</code> para probar los usuarios.
          </p>
        </div>
      </div>
    </div>
  );
}

