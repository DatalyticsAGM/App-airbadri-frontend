/**
 * Properties Catalog Page
 * 
 * Página de catálogo de propiedades con filtros
 */

'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PropertyGrid } from '@/components/properties/property-grid';
import { PropertyFiltersComponent } from '@/components/properties/property-filters';
import { mockProperties } from '@/lib/properties/mock-properties';
import { initializeMockProperties } from '@/lib/properties/mock-data';
import type { Property, PropertyFilters } from '@/lib/properties/types';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PropertyFilters>({});

  useEffect(() => {
    // Inicializar datos de ejemplo si no existen
    initializeMockProperties();

    // Cargar propiedades
    const loadProperties = async () => {
      try {
        const allProperties = await mockProperties.getAllProperties();
        setProperties(allProperties);
        setFilteredProperties(allProperties);
      } catch (error) {
        console.error('Error cargando propiedades:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    // Aplicar filtros cuando cambien
    const applyFilters = async () => {
      if (Object.keys(filters).length === 0) {
        setFilteredProperties(properties);
        return;
      }

      try {
        const filtered = await mockProperties.searchProperties(filters);
        setFilteredProperties(filtered);
      } catch (error) {
        console.error('Error aplicando filtros:', error);
      }
    };

    applyFilters();
  }, [filters, properties]);

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-airbnb-text-100 mb-2">
              Explorar Propiedades
            </h1>
            <p className="text-lg text-airbnb-text-200">
              Encuentra el lugar perfecto para tu próxima aventura
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar con filtros */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8">
                <PropertyFiltersComponent
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={() => setFilters({})}
                />
              </div>
            </aside>

            {/* Grid de propiedades */}
            <div className="lg:col-span-3">
              <div className="mb-4 text-sm text-airbnb-text-200">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
              </div>
              <PropertyGrid properties={filteredProperties} loading={loading} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

