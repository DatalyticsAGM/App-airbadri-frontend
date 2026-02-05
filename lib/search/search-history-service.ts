/**
 * Search History Service (Client Storage)
 *
 * Por qué existe: almacenar historial de búsquedas del usuario de forma simple.
 * Hoy se usa localStorage; si el backend expone un endpoint, se puede migrar aquí.
 */

import type { SearchHistory } from './types';

const STORAGE_KEY = 'airbnb_search_history';
const MAX_HISTORY_ITEMS = 10;
const NETWORK_DELAY = 100;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getSearchHistory(): SearchHistory[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as SearchHistory[];
  } catch (error) {
    console.error('Error leyendo historial de búsquedas:', error);
    return [];
  }
}

function saveSearchHistory(history: SearchHistory[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error guardando historial de búsquedas:', error);
  }
}

function generateSearchId(): string {
  return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

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
  const userHistory = history.filter((h) => h.userId === userId);

  const newSearch: SearchHistory = {
    id: generateSearchId(),
    userId,
    query,
    filters,
    timestamp: new Date().toISOString(),
    resultCount,
  };

  userHistory.unshift(newSearch);
  const limitedHistory = userHistory.slice(0, MAX_HISTORY_ITEMS);

  const otherUsersHistory = history.filter((h) => h.userId !== userId);
  const updatedHistory = [...limitedHistory, ...otherUsersHistory];

  saveSearchHistory(updatedHistory);
}

export async function getRecentSearches(userId: string): Promise<SearchHistory[]> {
  await delay(NETWORK_DELAY);

  const history = getSearchHistory();
  return history
    .filter((h) => h.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, MAX_HISTORY_ITEMS);
}

export async function deleteSearch(userId: string, searchId: string): Promise<void> {
  await delay(NETWORK_DELAY);

  const history = getSearchHistory();
  const updatedHistory = history.filter((h) => !(h.userId === userId && h.id === searchId));
  saveSearchHistory(updatedHistory);
}

export async function clearSearchHistory(userId: string): Promise<void> {
  await delay(NETWORK_DELAY);

  const history = getSearchHistory();
  const updatedHistory = history.filter((h) => h.userId !== userId);
  saveSearchHistory(updatedHistory);
}

