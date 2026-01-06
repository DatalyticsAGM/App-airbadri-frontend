/**
 * Mock Data for Properties
 * 
 * Datos de ejemplo para inicializar el sistema con propiedades
 */

import type { Property } from './types';

/**
 * Propiedades de ejemplo
 */
export const mockPropertiesData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Casa moderna con vista al mar en Barcelona',
    description: 'Hermosa casa moderna con vistas espectaculares al Mediterráneo. Ubicada en una zona tranquila pero cerca del centro de Barcelona. Perfecta para familias o grupos de amigos.',
    location: {
      city: 'Barcelona',
      country: 'España',
      address: 'Calle del Mar, 123',
      coordinates: { lat: 41.3851, lng: 2.1734 },
    },
    pricePerNight: 120,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    ],
    amenities: ['WiFi', 'Aire acondicionado', 'Cocina equipada', 'TV', 'Lavadora', 'Piscina'],
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    hostId: 'user_demo_host',
    hostName: 'María García - Anfitrión',
    rating: 4.8,
    reviewCount: 45,
  },
  {
    title: 'Apartamento céntrico en Madrid',
    description: 'Acogedor apartamento en el corazón de Madrid, a pocos minutos de los principales puntos de interés. Ideal para parejas o viajeros de negocios.',
    location: {
      city: 'Madrid',
      country: 'España',
      address: 'Calle Gran Vía, 45',
      coordinates: { lat: 40.4168, lng: -3.7038 },
    },
    pricePerNight: 85,
    images: [
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
    ],
    amenities: ['WiFi', 'Aire acondicionado', 'Cocina equipada', 'TV'],
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    hostId: 'user_demo_host',
    hostName: 'María García - Anfitrión',
    rating: 4.6,
    reviewCount: 32,
  },
  {
    title: 'Villa con piscina en Valencia',
    description: 'Espectacular villa con piscina privada y jardín. Perfecta para relajarse y disfrutar del clima mediterráneo. A 15 minutos de la playa.',
    location: {
      city: 'Valencia',
      country: 'España',
      address: 'Avenida del Sol, 78',
      coordinates: { lat: 39.4699, lng: -0.3763 },
    },
    pricePerNight: 200,
    images: [
      'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    ],
    amenities: ['WiFi', 'Aire acondicionado', 'Cocina equipada', 'TV', 'Lavadora', 'Piscina', 'Jardín', 'Parking'],
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    hostId: 'user_demo_host',
    hostName: 'María García - Anfitrión',
    rating: 4.9,
    reviewCount: 67,
  },
  {
    title: 'Estudio minimalista en Sevilla',
    description: 'Moderno estudio con diseño minimalista en el centro histórico de Sevilla. Perfecto para una escapada cultural.',
    location: {
      city: 'Sevilla',
      country: 'España',
      address: 'Calle Sierpes, 12',
      coordinates: { lat: 37.3891, lng: -5.9845 },
    },
    pricePerNight: 65,
    images: [
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
    ],
    amenities: ['WiFi', 'Aire acondicionado', 'Cocina básica', 'TV'],
    bedrooms: 0,
    bathrooms: 1,
    maxGuests: 2,
    hostId: 'user_demo_host',
    hostName: 'María García - Anfitrión',
    rating: 4.5,
    reviewCount: 28,
  },
  {
    title: 'Casa rural en los Pirineos',
    description: 'Encantadora casa rural con chimenea y vistas a las montañas. Ideal para desconectar y disfrutar de la naturaleza.',
    location: {
      city: 'Jaca',
      country: 'España',
      address: 'Carretera de los Pirineos, km 15',
      coordinates: { lat: 42.5700, lng: -0.5500 },
    },
    pricePerNight: 95,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg',
    ],
    amenities: ['WiFi', 'Chimenea', 'Cocina equipada', 'TV', 'Lavadora', 'Jardín'],
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    hostId: 'user_demo_host',
    hostName: 'María García - Anfitrión',
    rating: 4.7,
    reviewCount: 41,
  },
  {
    title: 'Loft industrial en Bilbao',
    description: 'Espacioso loft con estilo industrial en el centro de Bilbao. Cerca de museos, restaurantes y vida nocturna.',
    location: {
      city: 'Bilbao',
      country: 'España',
      address: 'Calle Ledesma, 34',
      coordinates: { lat: 43.2627, lng: -2.9253 },
    },
    pricePerNight: 110,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    ],
    amenities: ['WiFi', 'Calefacción', 'Cocina equipada', 'TV', 'Lavadora'],
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    hostId: 'user_demo_host',
    hostName: 'María García - Anfitrión',
    rating: 4.6,
    reviewCount: 38,
  },
  {
    title: 'Casa de playa en Málaga',
    description: 'Hermosa casa a pie de playa con terraza y vistas al mar. Perfecta para disfrutar del sol y la playa.',
    location: {
      city: 'Málaga',
      country: 'España',
      address: 'Paseo Marítimo, 89',
      coordinates: { lat: 36.7213, lng: -4.4214 },
    },
    pricePerNight: 150,
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    ],
    amenities: ['WiFi', 'Aire acondicionado', 'Cocina equipada', 'TV', 'Lavadora', 'Terraza', 'Parking'],
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    hostId: 'user_demo_host',
    hostName: 'María García - Anfitrión',
    rating: 4.8,
    reviewCount: 52,
  },
  {
    title: 'Apartamento con balcón en Granada',
    description: 'Acogedor apartamento con balcón con vistas a la Alhambra. En el corazón del barrio histórico de Albaicín.',
    location: {
      city: 'Granada',
      country: 'España',
      address: 'Calle Calderería, 23',
      coordinates: { lat: 37.1773, lng: -3.5986 },
    },
    pricePerNight: 75,
    images: [
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    ],
    amenities: ['WiFi', 'Aire acondicionado', 'Cocina equipada', 'TV', 'Balcón'],
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    hostId: 'user_demo_host',
    hostName: 'María García - Anfitrión',
    rating: 4.7,
    reviewCount: 35,
  },
];

/**
 * Inicializa datos de ejemplo en localStorage si no existen
 */
export function initializeMockProperties(): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = localStorage.getItem('airbnb_mock_properties');
    if (existing) {
      // Ya hay datos, no inicializar
      return;
    }

    // Crear propiedades con IDs y fechas
    const now = new Date().toISOString();
    const properties = mockPropertiesData.map((prop, index) => ({
      ...prop,
      id: `prop_example_${index + 1}`,
      createdAt: now,
      updatedAt: now,
    }));

    localStorage.setItem('airbnb_mock_properties', JSON.stringify(properties));
  } catch (error) {
    console.error('Error inicializando propiedades de ejemplo:', error);
  }
}

