/**
 * SearchInput Component
 *
 * Por qué existe: Proporciona un campo de búsqueda sencillo en el header
 * para que el usuario pueda buscar viviendas y navegar a la página
 * de propiedades con la query aplicada.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const params = new URLSearchParams({ q: trimmed });
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-3 py-2 rounded-full border border-airbnb-bg-300 bg-white shadow-sm w-[180px] sm:w-[240px] md:w-[320px]"
      role="search"
      aria-label="Buscar alojamientos"
    >
      <Search className="w-4 h-4 text-airbnb-text-200" aria-hidden="true" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="¿A dónde viajas?"
        className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        aria-label="Buscar alojamientos por ubicación"
      />
    </form>
  );
}


