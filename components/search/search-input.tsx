/**
 * Search Input Component
 * 
 * Componente de búsqueda con autocompletado en tiempo real.
 * Muestra sugerencias mientras el usuario escribe y permite navegación por teclado.
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchSuggestions } from './search-suggestions';
import { mockAutocomplete } from '@/lib/search/mock-autocomplete';
import { getRecentSearches } from '@/lib/search/mock-search-history';
import type { SearchSuggestion, SearchHistory } from '@/lib/search/types';
import { useAuth } from '@/lib/auth/auth-context';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

/**
 * Hook para debounce
 * Retarda la ejecución de una función hasta que no haya cambios por un tiempo determinado
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function SearchInput({
  onSearch,
  onSuggestionSelect,
  placeholder = 'Buscar propiedades...',
  className,
  initialValue = '',
}: SearchInputProps) {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SearchHistory[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce del texto de búsqueda (300ms)
  const debouncedSearchText = useDebounce(searchText, 300);

  /**
   * Carga sugerencias cuando el texto cambia
   */
  useEffect(() => {
    const loadSuggestions = async () => {
      if (debouncedSearchText.trim().length >= 2) {
        setLoading(true);
        try {
          const allSuggestions = await mockAutocomplete.getAllSuggestions(debouncedSearchText);
          setSuggestions(allSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error cargando sugerencias:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else if (debouncedSearchText.trim().length === 0) {
        // Si no hay texto, mostrar búsquedas populares
        setLoading(true);
        try {
          const popular = await mockAutocomplete.getAllSuggestions();
          setSuggestions(popular);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error cargando búsquedas populares:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    loadSuggestions();
  }, [debouncedSearchText]);

  /**
   * Carga historial cuando el input está vacío y el usuario está autenticado
   */
  useEffect(() => {
    const loadHistory = async () => {
      if (user && searchText.trim().length === 0) {
        try {
          const recentSearches = await getRecentSearches(user.id);
          setHistory(recentSearches);
          setShowHistory(recentSearches.length > 0);
        } catch (error) {
          console.error('Error cargando historial:', error);
        }
      } else {
        setShowHistory(false);
      }
    };

    loadHistory();
  }, [user, searchText]);

  /**
   * Maneja la selección de una sugerencia
   * Agregamos un pequeño delay antes de cerrar para mejorar la UX
   */
  const handleSuggestionSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      setSearchText(suggestion.text);
      
      // Pequeño delay antes de cerrar para que el usuario vea la selección
      setTimeout(() => {
        setShowSuggestions(false);
        setShowHistory(false);
      }, 200);

      if (onSuggestionSelect) {
        onSuggestionSelect(suggestion);
      } else {
        onSearch(suggestion.text);
      }
    },
    [onSearch, onSuggestionSelect]
  );

  /**
   * Maneja la navegación por teclado
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions && !showHistory) return;

    const items = showHistory ? history : suggestions;
    const maxIndex = items.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          if (showHistory) {
            const historyItem = history[selectedIndex];
            setSearchText(historyItem.query);
            onSearch(historyItem.query);
          } else {
            handleSuggestionSelect(suggestions[selectedIndex]);
          }
          setShowSuggestions(false);
          setShowHistory(false);
        } else if (searchText.trim().length > 0) {
          onSearch(searchText);
          setShowSuggestions(false);
          setShowHistory(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setShowHistory(false);
        setSelectedIndex(-1);
        break;
    }
  };

  /**
   * Maneja el click fuera del componente para cerrar sugerencias
   * Usa un pequeño delay para evitar que se cierre inmediatamente cuando el usuario
   * hace click en una sugerencia o historial
   */
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Pequeño delay para evitar que se cierre muy rápido
        timeoutId = setTimeout(() => {
          setShowSuggestions(false);
          setShowHistory(false);
          setSelectedIndex(-1);
        }, 150); // 150ms de delay
      } else {
        // Si el click es dentro, cancelar cualquier timeout pendiente
        clearTimeout(timeoutId);
      }
    };

    // Usar mousedown para mejor UX
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timeoutId);
    };
  }, []);

  /**
   * Maneja la selección de una búsqueda del historial
   * Agregamos un pequeño delay antes de cerrar para mejorar la UX
   */
  const handleHistorySelect = (historyItem: SearchHistory) => {
    setSearchText(historyItem.query);
    
    // Pequeño delay antes de cerrar para que el usuario vea la selección
    setTimeout(() => {
      setShowHistory(false);
      setShowSuggestions(false);
    }, 200);
    
    onSearch(historyItem.query);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-airbnb-text-200" />
        <Input
          ref={inputRef}
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setSelectedIndex(-1);
            if (e.target.value.trim().length > 0) {
              setShowHistory(false);
            }
          }}
          onFocus={() => {
            // Mostrar sugerencias/historial al hacer focus
            if (searchText.trim().length >= 2) {
              setShowSuggestions(true);
              setShowHistory(false);
            } else if (user && history.length > 0) {
              setShowHistory(true);
              setShowSuggestions(false);
            } else {
              // Si no hay texto, mostrar búsquedas populares
              setShowSuggestions(true);
              setShowHistory(false);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {searchText && (
          <button
            type="button"
            onClick={() => {
              setSearchText('');
              setShowSuggestions(false);
              setShowHistory(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-airbnb-text-200 hover:text-airbnb-text-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mostrar historial si está vacío y hay historial */}
      {showHistory && history.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-airbnb-bg-300 z-50 max-h-80 overflow-y-auto">
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-airbnb-text-200 uppercase">
              Búsquedas recientes
            </div>
            {history.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleHistorySelect(item)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-airbnb-bg-200 transition-colors',
                  selectedIndex === index && 'bg-airbnb-bg-200'
                )}
              >
                <Search className="w-4 h-4 text-airbnb-text-200 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-airbnb-text-100 truncate">
                    {item.query}
                  </div>
                  {item.filters?.location && (
                    <p className="text-sm text-airbnb-text-200 truncate mt-0.5">
                      {item.filters.location}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mostrar sugerencias */}
      {showSuggestions && (
        <SearchSuggestions
          suggestions={suggestions}
          loading={loading}
          onSelect={handleSuggestionSelect}
          selectedIndex={selectedIndex}
        />
      )}
    </div>
  );
}

