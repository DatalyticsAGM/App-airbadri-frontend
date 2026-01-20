/**
 * Search Results Component
 * 
 * Componente que muestra los resultados de búsqueda con opciones de ordenamiento
 * y paginación básica.
 */

'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, List, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PropertyGrid } from '@/components/properties';
import { sortByRelevance, sortByPrice, sortByRating, sortByNewest } from '@/lib/search/sort-utils';
import type { Property } from '@/lib/properties/types';
import { cn } from '@/lib/utils';

interface SearchResultsProps {
  properties: Property[];
  loading?: boolean;
  searchQuery?: string;
  onPropertyClick?: (property: Property) => void;
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
type ViewMode = 'grid' | 'list';

export function SearchResults({
  properties,
  loading = false,
  searchQuery = '',
  onPropertyClick,
}: SearchResultsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  /**
   * Ordena las propiedades según el criterio seleccionado
   */
  const sortedProperties = useMemo(() => {
    let sorted = [...properties];

    switch (sortBy) {
      case 'relevance':
        sorted = sortByRelevance(sorted, searchQuery);
        break;
      case 'price-asc':
        sorted = sortByPrice(sorted, true);
        break;
      case 'price-desc':
        sorted = sortByPrice(sorted, false);
        break;
      case 'rating':
        sorted = sortByRating(sorted);
        break;
      case 'newest':
        sorted = sortByNewest(sorted);
        break;
    }

    return sorted;
  }, [properties, sortBy, searchQuery]);

  /**
   * Calcula la paginación
   */
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProperties = sortedProperties.slice(startIndex, endIndex);

  /**
   * Maneja el cambio de página
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll al inicio de los resultados
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-airbnb-bg-200 rounded animate-pulse" />
        <PropertyGrid properties={[]} loading={true} />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold text-airbnb-text-100 mb-2">
          No se encontraron propiedades
        </p>
        <p className="text-airbnb-text-200">
          Intenta ajustar tus filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con ordenamiento y vista */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-airbnb-text-100 font-medium">
            {sortedProperties.length} {sortedProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Selector de ordenamiento */}
          <Select value={sortBy} onValueChange={(value) => {
            setSortBy(value as SortOption);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
              <SelectItem value="rating">Mejor valorado</SelectItem>
              <SelectItem value="newest">Más reciente</SelectItem>
            </SelectContent>
          </Select>

          {/* Toggle de vista (opcional, por ahora solo grid) */}
          <div className="hidden sm:flex items-center gap-1 border border-airbnb-bg-300 rounded-lg p-1">
            <Button
              type="button"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid de propiedades */}
      <PropertyGrid properties={paginatedProperties} />

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Mostrar primera, última, actual y adyacentes
                return (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                );
              })
              .map((page, index, array) => {
                // Agregar puntos suspensivos si hay gap
                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                return (
                  <div key={page} className="flex items-center gap-1">
                    {showEllipsis && <span className="px-2">...</span>}
                    <Button
                      type="button"
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  </div>
                );
              })}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}



