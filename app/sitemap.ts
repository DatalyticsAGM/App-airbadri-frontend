/**
 * Sitemap for SEO
 * 
 * Genera sitemap dinámico con todas las propiedades
 */

import { MetadataRoute } from 'next';
import { mockProperties } from '@/lib/properties/mock-properties';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://airbnb.example.com';

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Páginas dinámicas de propiedades
  try {
    const properties = await mockProperties.getAllProperties();
    const propertyPages: MetadataRoute.Sitemap = properties.map((property) => ({
      url: `${baseUrl}/properties/${property.id}`,
      lastModified: new Date(property.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...propertyPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}





