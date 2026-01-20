/**
 * Properties Catalog Page
 * 
 * Página de catálogo de propiedades con filtros
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PropertyGrid, PropertyFiltersComponent } from '@/components/properties';
import {
  AdvancedSearch,
  SearchInput,
  QuickFilters,
  SearchResults,
  SearchHistoryComponent,
} from '@/components/search';
import { mockProperties } from '@/lib/properties/mock-properties';
import { initializeMockProperties } from '@/lib/properties/mock-data';
import { saveSearch } from '@/lib/search/mock-search-history';
import type { Property, PropertyFilters } from '@/lib/properties/types';
import type { SearchSuggestion } from '@/lib/search/types';
import { useAuth } from '@/lib/auth/auth-context';

export default function PropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

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

    // Escuchar búsquedas desde el header
    const handleHeaderSearch = (event: CustomEvent<{ query: string }>) => {
      setSearchQuery(event.detail.query);
    };

    window.addEventListener('header-search', handleHeaderSearch as EventListener);

    // Leer query params de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }

    return () => {
      window.removeEventListener('header-search', handleHeaderSearch as EventListener);
    };
  }, []);

  /**
   * Aplica filtros y búsqueda
   */
  const applyFilters = useCallback(async () => {
    try {
      // Combinar búsqueda de texto con filtros
      const searchFilters: PropertyFilters = {
        ...filters,
        ...(searchQuery && { searchText: searchQuery, location: searchQuery }),
      };

      if (Object.keys(searchFilters).length === 0) {
        setFilteredProperties(properties);
        return;
      }

      const filtered = await mockProperties.searchProperties(searchFilters);
      setFilteredProperties(filtered);

      // Guardar búsqueda en historial si hay usuario autenticado
      if (user && (searchQuery || Object.keys(filters).length > 0)) {
        await saveSearch(
          user.id,
          searchQuery || 'Búsqueda con filtros',
          {
            location: filters.location,
            priceRange: filters.priceRange,
            guests: filters.guests,
          },
          filtered.length
        );
      }
    } catch (error) {
      console.error('Error aplicando filtros:', error);
    }
  }, [filters, properties, searchQuery, user]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  /**
   * Maneja la búsqueda desde el SearchInput
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Los filtros se aplicarán automáticamente en el useEffect
  }, []);

  /**
   * Maneja la selección de una sugerencia
   */
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    if (suggestion.type === 'property' && suggestion.propertyId) {
      // Redirigir a la página de detalle de la propiedad
      window.location.href = `/properties/${suggestion.propertyId}`;
    } else {
      // Usar el texto de la sugerencia como búsqueda
      setSearchQuery(suggestion.text);
    }
  }, []);

  /**
   * Maneja el cambio de filtros desde QuickFilters
   */
  const handleQuickFiltersChange = useCallback((newFilters: PropertyFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-airbnb-text-100 mb-2">
              Explorar Propiedades
            </h1>
            <p className="text-lg text-airbnb-text-200 mb-6">
              Encuentra el lugar perfecto para tu próxima aventura
            </p>

            {/* Barra de búsqueda - Solo visible en mobile */}
            <div className="mb-6 md:hidden">
              <SearchInput
                onSearch={handleSearch}
                onSuggestionSelect={handleSuggestionSelect}
                placeholder="Buscar por ubicación, propiedad..."
                initialValue={searchQuery}
              />
            </div>

            {/* Filtros rápidos */}
            <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-airbnb-bg-300">
              <QuickFilters
                onFiltersChange={handleQuickFiltersChange}
                activeFilters={filters}
              />
            </div>
          </div>

          {/* Advanced Search - Mobile/Tablet */}
          <div className="lg:hidden mb-6">
            <AdvancedSearch
              onSearch={setFilters}
              initialFilters={filters}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar con filtros */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Advanced Search - Desktop */}
                <div className="hidden lg:block">
                  <AdvancedSearch
                    onSearch={setFilters}
                    initialFilters={filters}
                  />
                </div>
                <PropertyFiltersComponent
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={() => setFilters({})}
                />
              </div>
            </aside>

            {/* Resultados de búsqueda */}
            <div className="lg:col-span-3">
              <SearchResults
                properties={filteredProperties}
                loading={loading}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

