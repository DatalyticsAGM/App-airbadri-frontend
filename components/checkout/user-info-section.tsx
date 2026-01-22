/**
 * User Info Section Component
 * 
 * Componente que muestra y permite editar la información del usuario en el checkout.
 * Pre-llena los datos del usuario autenticado y permite editarlos antes de confirmar.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CheckoutFormData } from '@/lib/checkout/types';

interface UserInfoSectionProps {
  initialData?: {
    fullName: string;
    email: string;
    phone?: string;
    creditCard?: string;
  };
  onDataChange?: (data: CheckoutFormData) => void;
}

export function UserInfoSection({ initialData, onDataChange }: UserInfoSectionProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    creditCard: initialData?.creditCard || '',
  });

  // Usar ref para evitar loops infinitos con onDataChange
  const onDataChangeRef = useRef(onDataChange);
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

  // Bandera para saber si el cambio viene del usuario o de initialData
  const isUserChangeRef = useRef(false);
  const isInitialMountRef = useRef(true);

  // Actualizar cuando cambien los datos iniciales (solo en el montaje inicial o si cambian realmente)
  useEffect(() => {
    if (initialData) {
      const newData = {
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        creditCard: initialData.creditCard || '',
      };
      
      // Solo actualizar si es el montaje inicial o si los datos son diferentes
      if (
        isInitialMountRef.current ||
        newData.fullName !== formData.fullName ||
        newData.email !== formData.email ||
        newData.phone !== formData.phone ||
        newData.creditCard !== formData.creditCard
      ) {
        isUserChangeRef.current = false; // Marcar que NO es cambio del usuario
        setFormData(newData);
        isInitialMountRef.current = false;
      }
    }
  }, [initialData?.fullName, initialData?.email, initialData?.phone, initialData?.creditCard]);

  // Notificar cambios al componente padre solo cuando el usuario modifica los datos
  useEffect(() => {
    if (onDataChangeRef.current && isUserChangeRef.current && !isInitialMountRef.current) {
      onDataChangeRef.current(formData);
    }
  }, [formData]);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    // Marcar que el cambio viene del usuario
    isUserChangeRef.current = true;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-airbnb-bg-300/30">
      <h3 className="text-xl font-bold text-airbnb-text-100 mb-4">
        Información de Contacto
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre Completo</Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Nombre completo"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@ejemplo.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono (opcional)</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+34 600 000 000"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="creditCard">Tarjeta de Crédito (opcional)</Label>
          <Input
            id="creditCard"
            type="text"
            value={formData.creditCard || ''}
            onChange={(e) => {
              // Formatear número de tarjeta: solo números y espacios cada 4 dígitos
              const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
              const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
              handleChange('creditCard', formatted);
            }}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
          <p className="text-xs text-airbnb-text-200">
            Puedes agregar tu tarjeta ahora o pagar más tarde
          </p>
        </div>
      </div>
    </div>
  );
}

