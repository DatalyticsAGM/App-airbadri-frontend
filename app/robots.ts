/**
 * Robots.txt for SEO
 * 
 * Configuración de crawling para motores de búsqueda
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://airbnb.example.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/profile/',
          '/bookings/',
          '/properties/create/',
          '/properties/*/edit/',
          '/properties/my-properties/',
          '/favorites/',
          '/debug-init/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}





