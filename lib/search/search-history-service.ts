/**
 * Search History Service (API Real)
 *
 * Por qué existe: el historial debe persistir en backend (no localStorage)
 * para mantener consistencia entre dispositivos y sesiones.
 */

import type { SearchHistory } from './types';
import { apiClient } from '@/lib/api/client';

const MAX_HISTORY_ITEMS = 10;

function unwrapList(raw: any): any[] {
  const list = Array.isArray(raw) ? raw : raw?.data ?? raw?.history ?? raw?.items ?? raw?.results ?? [];
  return Array.isArray(list) ? list : [];
}

function coerceString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function normalizeHistoryItem(raw: any): SearchHistory {
  return {
    id: coerceString(raw?.id || raw?._id),
    userId: coerceString(raw?.userId),
    query: coerceString(raw?.query),
    filters: raw?.filters,
    timestamp: coerceString(raw?.timestamp || raw?.createdAt) || new Date().toISOString(),
    resultCount: typeof raw?.resultCount === 'number' ? raw.resultCount : undefined,
  };
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
  // Endpoint esperado (REST simple): POST /search-history
  await apiClient.post('/search-history', {
    userId,
    query,
    filters,
    resultCount,
  });
}

export async function getRecentSearches(userId: string): Promise<SearchHistory[]> {
  const raw = await apiClient.get<any>(`/search-history?userId=${encodeURIComponent(userId)}&limit=${MAX_HISTORY_ITEMS}`);
  return unwrapList(raw).map(normalizeHistoryItem).slice(0, MAX_HISTORY_ITEMS);
}

export async function deleteSearch(userId: string, searchId: string): Promise<void> {
  // DELETE /search-history/:id (con userId opcional por compatibilidad)
  await apiClient.delete(`/search-history/${encodeURIComponent(searchId)}?userId=${encodeURIComponent(userId)}`);
}

export async function clearSearchHistory(userId: string): Promise<void> {
  // DELETE /search-history?userId=... (borra el historial del usuario)
  await apiClient.delete(`/search-history?userId=${encodeURIComponent(userId)}`);
}

