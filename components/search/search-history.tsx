/**
 * Search History Component
 * 
 * Componente que muestra el historial de búsquedas del usuario.
 * Permite repetir búsquedas anteriores y gestionar el historial.
 */

'use client';

import { useState, useEffect } from 'react';
import { Search, Clock, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  getRecentSearches,
  deleteSearch,
  clearSearchHistory,
} from '@/lib/search/mock-search-history';
import type { SearchHistory } from '@/lib/search/types';
import { useAuth } from '@/lib/auth/auth-context';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface SearchHistoryProps {
  onSelectSearch: (query: string, filters?: SearchHistory['filters']) => void;
}

export function SearchHistoryComponent({ onSelectSearch }: SearchHistoryProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Carga el historial de búsquedas del usuario
   */
  const loadHistory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const recentSearches = await getRecentSearches(user.id);
      setHistory(recentSearches);
    } catch (error) {
      console.error('Error cargando historial:', error);
      toast.error('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      loadHistory();
    }
  }, [isOpen, user]);

  /**
   * Maneja la selección de una búsqueda del historial
   */
  const handleSelect = (historyItem: SearchHistory) => {
    onSelectSearch(historyItem.query, historyItem.filters);
    setIsOpen(false);
  };

  /**
   * Elimina una búsqueda específica del historial
   */
  const handleDelete = async (searchId: string) => {
    if (!user) return;

    try {
      await deleteSearch(user.id, searchId);
      await loadHistory();
      toast.success('Búsqueda eliminada');
    } catch (error) {
      console.error('Error eliminando búsqueda:', error);
      toast.error('Error al eliminar la búsqueda');
    }
  };

  /**
   * Limpia todo el historial
   */
  const handleClearAll = async () => {
    if (!user) return;

    try {
      await clearSearchHistory(user.id);
      setHistory([]);
      toast.success('Historial limpiado');
    } catch (error) {
      console.error('Error limpiando historial:', error);
      toast.error('Error al limpiar el historial');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Clock className="w-4 h-4" />
          Historial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Historial de búsquedas</DialogTitle>
          <DialogDescription>
            Tus búsquedas recientes. Haz clic para repetir una búsqueda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-airbnb-text-200">Cargando...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="w-12 h-12 text-airbnb-text-200 mb-2" />
              <p className="text-airbnb-text-200">No hay búsquedas recientes</p>
            </div>
          ) : (
            <>
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-airbnb-bg-300 hover:bg-airbnb-bg-200 transition-colors group"
                >
                  <Search className="w-4 h-4 text-airbnb-text-200 flex-shrink-0" />
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="font-medium text-airbnb-text-100 truncate">
                      {item.query}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {item.filters?.location && (
                        <span className="text-xs text-airbnb-text-200">
                          {item.filters.location}
                        </span>
                      )}
                      <span className="text-xs text-airbnb-text-200">
                        {formatDistanceToNow(new Date(item.timestamp), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                      {item.resultCount !== undefined && (
                        <span className="text-xs text-airbnb-text-200">
                          • {item.resultCount} resultados
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-airbnb-text-200 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="pt-2 border-t border-airbnb-bg-300">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpiar todo el historial
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}



