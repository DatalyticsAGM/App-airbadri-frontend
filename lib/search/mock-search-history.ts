/**
 * Mock Search History Service
 * 
 * Servicio MOCK para gestionar el historial de búsquedas del usuario.
 * Almacena las búsquedas recientes en localStorage.
 * 
 * Almacenamiento: localStorage key 'airbnb_search_history'
 */

import type { SearchHistory } from './types';

const STORAGE_KEY = 'airbnb_search_history';
const MAX_HISTORY_ITEMS = 10;
const NETWORK_DELAY = 100;

/**
 * Simula un delay de red
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtiene el historial de búsquedas del localStorage
 * 
 * @returns Lista de búsquedas guardadas
 */
function getSearchHistory(): SearchHistory[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const allHistory = JSON.parse(stored) as SearchHistory[];
    return allHistory;
  } catch (error) {
    console.error('Error leyendo historial de búsquedas:', error);
    return [];
  }
}

/**
 * Guarda el historial de búsquedas en localStorage
 * 
 * @param history - Lista de búsquedas a guardar
 */
function saveSearchHistory(history: SearchHistory[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error guardando historial de búsquedas:', error);
  }
}

/**
 * Genera un ID único para una búsqueda
 */
function generateSearchId(): string {
  return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Guarda una búsqueda en el historial del usuario
 * Solo guarda las últimas MAX_HISTORY_ITEMS búsquedas
 * 
 * @param userId - ID del usuario
 * @param query - Texto de búsqueda
 * @param filters - Filtros aplicados (opcional)
 * @param resultCount - Número de resultados encontrados (opcional)
 */
export async function saveSearch(
  userId: string,
  query: string,
  filters?: {
    location?: string;
    priceRange?: { min: number; max: number };
    guests?: number;
  },
  resultCount?: number
): Promise<void> {
  await delay(NETWORK_DELAY);

  const history = getSearchHistory();

  // Filtrar búsquedas del usuario actual
  const userHistory = history.filter(h => h.userId === userId);

  // Crear nueva entrada de búsqueda
  const newSearch: SearchHistory = {
    id: generateSearchId(),
    userId,
    query,
    filters,
    timestamp: new Date().toISOString(),
    resultCount,
  };

  // Agregar al inicio y mantener solo las últimas MAX_HISTORY_ITEMS
  userHistory.unshift(newSearch);
  const limitedHistory = userHistory.slice(0, MAX_HISTORY_ITEMS);

  // Combinar con historial de otros usuarios y guardar
  const otherUsersHistory = history.filter(h => h.userId !== userId);
  const updatedHistory = [...limitedHistory, ...otherUsersHistory];

  saveSearchHistory(updatedHistory);
}

/**
 * Obtiene las búsquedas recientes del usuario
 * Retorna las últimas MAX_HISTORY_ITEMS búsquedas
 * 
 * @param userId - ID del usuario
 * @returns Lista de búsquedas recientes
 */
export async function getRecentSearches(userId: string): Promise<SearchHistory[]> {
  await delay(NETWORK_DELAY);

  const history = getSearchHistory();
  const userHistory = history
    .filter(h => h.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, MAX_HISTORY_ITEMS);

  return userHistory;
}

/**
 * Elimina una búsqueda específica del historial
 * 
 * @param userId - ID del usuario
 * @param searchId - ID de la búsqueda a eliminar
 */
export async function deleteSearch(userId: string, searchId: string): Promise<void> {
  await delay(NETWORK_DELAY);

  const history = getSearchHistory();
  const updatedHistory = history.filter(
    h => !(h.userId === userId && h.id === searchId)
  );

  saveSearchHistory(updatedHistory);
}

/**
 * Limpia todo el historial de búsquedas del usuario
 * 
 * @param userId - ID del usuario
 */
export async function clearSearchHistory(userId: string): Promise<void> {
  await delay(NETWORK_DELAY);

  const history = getSearchHistory();
  const updatedHistory = history.filter(h => h.userId !== userId);

  saveSearchHistory(updatedHistory);
}





