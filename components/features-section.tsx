/**
 * Features Section Component
 *
 * Muestra las características principales del servicio
 * Diseño con cards minimalistas
 */

import { Globe, Shield, Heart, Star } from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Global destinations',
    description: 'Explore unique stays in over 190 countries around the world.',
  },
  {
    icon: Shield,
    title: 'Secure booking',
    description: 'Book with confidence with our secure payment system and protection.',
  },
  {
    icon: Heart,
    title: 'Unique experiences',
    description: 'Stay in extraordinary homes hosted by locals who care.',
  },
  {
    icon: Star,
    title: 'Verified reviews',
    description: 'Read authentic reviews from real guests who stayed there.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-airbnb-bg-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-airbnb-text-100 mb-4">
            Why choose Airbnb
          </h2>
          <p className="text-lg text-airbnb-text-200 max-w-2xl mx-auto">
            Discover the benefits of booking your next adventure with us
          </p>
        </div>

        {/* Features Grid */}
        {/* TODO: Considerar agregar animaciones al hacer scroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-airbnb-primary-300 rounded-full flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-airbnb-primary-100" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-airbnb-text-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-airbnb-text-200 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
