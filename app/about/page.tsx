/**
 * About Page
 * 
 * Página "Acerca de" que presenta información sobre Airbnb
 * 
 * Ruta: /about
 */

import Link from 'next/link';
import { Home, Heart, Globe, Users, Shield } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      <Header />

      {/* Contenido principal */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-airbnb-text-100 mb-4">
              Acerca de Airbnb
            </h1>
            <p className="text-xl text-airbnb-text-200 max-w-3xl mx-auto">
              Conectamos a millones de viajeros con alojamientos únicos y experiencias inolvidables en todo el mundo
            </p>
          </div>

          {/* Sección de Misión */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-airbnb-text-100 mb-6">
                Nuestra Misión
              </h2>
              <p className="text-lg text-airbnb-text-200 leading-relaxed mb-4">
                En Airbnb, creemos que viajar debería ser una experiencia auténtica y personal. 
                Nuestra plataforma permite a las personas descubrir alojamientos únicos y experiencias 
                locales que no encontrarían en ningún otro lugar.
              </p>
              <p className="text-lg text-airbnb-text-200 leading-relaxed">
                Desde casas en el árbol hasta castillos, desde experiencias culinarias hasta aventuras 
                al aire libre, ayudamos a crear recuerdos que duran toda la vida.
              </p>
            </div>
          </section>

          {/* Valores */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-airbnb-text-100 mb-12 text-center">
              Nuestros Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <Heart className="w-12 h-12 text-airbnb-primary-100 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-airbnb-text-100 mb-2">
                  Pasión
                </h3>
                <p className="text-airbnb-text-200">
                  Amamos lo que hacemos y nos apasiona conectar personas con lugares increíbles
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <Globe className="w-12 h-12 text-airbnb-accent-100 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-airbnb-text-100 mb-2">
                  Diversidad
                </h3>
                <p className="text-airbnb-text-200">
                  Celebramos la diversidad y creemos en la inclusión de todas las comunidades
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <Users className="w-12 h-12 text-airbnb-primary-100 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-airbnb-text-100 mb-2">
                  Comunidad
                </h3>
                <p className="text-airbnb-text-200">
                  Construimos una comunidad global de anfitriones y huéspedes que se apoyan mutuamente
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <Shield className="w-12 h-12 text-airbnb-accent-100 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-airbnb-text-100 mb-2">
                  Seguridad
                </h3>
                <p className="text-airbnb-text-200">
                  La seguridad y confianza de nuestra comunidad es nuestra máxima prioridad
                </p>
              </div>
            </div>
          </section>

          {/* Estadísticas */}
          <section className="mb-20">
            <div className="bg-gradient-to-r from-airbnb-primary-100 to-airbnb-primary-200 rounded-2xl shadow-lg p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-12">
                Airbnb en Números
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-5xl font-bold mb-2">7M+</div>
                  <div className="text-xl opacity-90">Alojamientos únicos</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">220+</div>
                  <div className="text-xl opacity-90">Países y regiones</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">1B+</div>
                  <div className="text-xl opacity-90">Huéspedes alojados</div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="bg-airbnb-bg-200 rounded-2xl p-12">
              <h2 className="text-3xl font-bold text-airbnb-text-100 mb-4">
                ¿Listo para comenzar tu aventura?
              </h2>
              <p className="text-lg text-airbnb-text-200 mb-8">
                Explora destinos únicos y crea recuerdos inolvidables
              </p>
              <Link
                href="/"
                className="inline-block bg-airbnb-primary-100 text-white px-8 py-4 rounded-lg font-semibold hover:bg-airbnb-primary-100/90 transition-colors"
              >
                Explorar Destinos
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
