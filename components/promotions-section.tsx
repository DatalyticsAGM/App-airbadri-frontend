/**
 * Promotions Section Component
 *
 * Muestra las promociones actuales disponibles
 * Cards con imágenes y descripciones de las ofertas
 */

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const promotions = [
  {
    id: 1,
    title: 'Summer getaway special',
    discount: '25% OFF',
    description: 'Book your summer vacation now and save on amazing beachfront properties.',
    image: 'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=800',
    validUntil: 'Valid until Aug 31',
  },
  {
    id: 2,
    title: 'Mountain retreat',
    discount: '30% OFF',
    description: 'Escape to the mountains with exclusive discounts on cozy cabins.',
    image: 'https://images.pexels.com/photos/1178498/pexels-photo-1178498.jpeg?auto=compress&cs=tinysrgb&w=800',
    validUntil: 'Valid until Sep 15',
  },
  {
    id: 3,
    title: 'City explorer pass',
    discount: '20% OFF',
    description: 'Discover urban adventures with discounts on city center apartments.',
    image: 'https://images.pexels.com/photos/1447758/pexels-photo-1447758.jpeg?auto=compress&cs=tinysrgb&w=800',
    validUntil: 'Valid until Oct 1',
  },
];

export function PromotionsSection() {
  return (
    <section id="promotions" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-airbnb-primary-300 text-airbnb-primary-100 hover:bg-airbnb-primary-300 mb-4 px-4 py-2 text-sm font-semibold">
            LIMITED TIME OFFERS
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-airbnb-text-100 mb-4">
            Special promotions
          </h2>
          <p className="text-lg text-airbnb-text-200 max-w-2xl mx-auto">
            Take advantage of our exclusive offers and save on your next trip
          </p>
        </div>

        {/* Promotions Grid */}
        {/* TODO: Integrar con base de datos para cargar promociones dinámicamente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-airbnb-primary-100 text-white hover:bg-airbnb-primary-100 font-bold text-base px-4 py-2">
                    {promo.discount}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-airbnb-text-100 mb-3">
                  {promo.title}
                </h3>
                <p className="text-airbnb-text-200 mb-4 leading-relaxed">
                  {promo.description}
                </p>
                <p className="text-sm text-airbnb-accent-100 font-medium mb-6">
                  {promo.validUntil}
                </p>

                {/* FIXME: Conectar con sistema de reservas real */}
                <Button
                  className="w-full bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white font-semibold rounded-full"
                >
                  Book now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
