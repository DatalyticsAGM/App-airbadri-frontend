/**
 * Dynamic Metadata for Property Detail Page
 */

import { generatePropertyMetadata } from '@/lib/seo/metadata';
import { mockProperties } from '@/lib/properties/mock-properties';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const property = await mockProperties.getPropertyById(params.id);
    
    if (!property) {
      return {
        title: 'Propiedad no encontrada',
      };
    }

    return generatePropertyMetadata(property);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Propiedad',
    };
  }
}

