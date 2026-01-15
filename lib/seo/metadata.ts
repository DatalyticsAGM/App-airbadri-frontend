/**
 * SEO Metadata Utilities
 * 
 * Funciones para generar metadata dinámica
 */

import type { Metadata } from 'next';
import type { Property } from '@/lib/properties/types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://airbnb.example.com';
const siteName = 'Airbnb';

/**
 * Generar metadata para una propiedad
 */
export function generatePropertyMetadata(property: Property): Metadata {
  const title = `${property.title} - ${property.location.city}, ${property.location.country} | ${siteName}`;
  const description = property.description.substring(0, 160) || `Alquila ${property.title} en ${property.location.city}`;
  const image = property.images[0] || `${baseUrl}/og-image.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      type: 'website',
      locale: 'es_ES',
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

/**
 * Generar metadata para el catálogo de propiedades
 */
export function generatePropertiesMetadata(): Metadata {
  return {
    title: `Explorar Propiedades - ${siteName}`,
    description: 'Descubre miles de propiedades únicas en todo el mundo. Encuentra el lugar perfecto para tu próxima aventura.',
    openGraph: {
      title: `Explorar Propiedades - ${siteName}`,
      description: 'Descubre miles de propiedades únicas en todo el mundo',
      type: 'website',
      siteName,
    },
  };
}

/**
 * Metadata base del sitio
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: 'Descubre lugares únicos para quedarte y experiencias inolvidables en todo el mundo',
  keywords: ['alquiler', 'vacaciones', 'propiedades', 'airbnb', 'viajes'],
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: baseUrl,
    siteName,
    title: siteName,
    description: 'Descubre lugares únicos para quedarte y experiencias inolvidables',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: 'Descubre lugares únicos para quedarte',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

