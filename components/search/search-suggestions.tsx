/**
 * Search Suggestions Component
 * 
 * Componente que muestra sugerencias de búsqueda mientras el usuario escribe.
 * Muestra ubicaciones, propiedades y búsquedas populares.
 */

'use client';

import { SearchSuggestion } from '@/lib/search/types';
import { MapPin, Home, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  loading?: boolean;
  onSelect: (suggestion: SearchSuggestion) => void;
  selectedIndex?: number;
}

export function SearchSuggestions({
  suggestions,
  loading = false,
  onSelect,
  selectedIndex = -1,
}: SearchSuggestionsProps) {
  if (loading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-airbnb-bg-300 z-50 max-h-80 overflow-y-auto">
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-5 h-5 animate-spin text-airbnb-primary-100" />
          <span className="ml-2 text-airbnb-text-200">Buscando...</span>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  const getIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'location':
        return <MapPin className="w-4 h-4" />;
      case 'property':
        return <Home className="w-4 h-4" />;
      case 'popular':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'location':
        return 'Ubicación';
      case 'property':
        return 'Propiedad';
      case 'popular':
        return 'Popular';
      default:
        return '';
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-airbnb-bg-300 z-50 max-h-80 overflow-y-auto">
      <div className="py-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion.id}
            type="button"
            onClick={() => onSelect(suggestion)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-airbnb-bg-200 transition-colors',
              selectedIndex === index && 'bg-airbnb-bg-200'
            )}
          >
            <div className="text-airbnb-text-200 flex-shrink-0">
              {getIcon(suggestion.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-airbnb-text-100 truncate">
                  {suggestion.text}
                </span>
                <span className="text-xs text-airbnb-text-200 bg-airbnb-bg-200 px-2 py-0.5 rounded">
                  {getTypeLabel(suggestion.type)}
                </span>
              </div>
              {suggestion.subtitle && (
                <p className="text-sm text-airbnb-text-200 truncate mt-0.5">
                  {suggestion.subtitle}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}





