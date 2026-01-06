/**
 * Footer Component
 *
 * Footer con enlaces de navegación y información legal
 * Diseño limpio y organizado
 */

import { Home, Facebook, Twitter, Instagram } from 'lucide-react';

const footerLinks = {
  about: [
    { name: 'How Airbnb works', href: '#' },
    { name: 'Newsroom', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Investors', href: '#' },
  ],
  community: [
    { name: 'Diversity & Belonging', href: '#' },
    { name: 'Accessibility', href: '#' },
    { name: 'Airbnb Associates', href: '#' },
    { name: 'Guest Referrals', href: '#' },
  ],
  host: [
    { name: 'Host your home', href: '#' },
    { name: 'Host an experience', href: '#' },
    { name: 'Responsible hosting', href: '#' },
    { name: 'Resource Center', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Safety information', href: '#' },
    { name: 'Cancellation options', href: '#' },
    { name: 'COVID-19 Response', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-airbnb-bg-200 border-t border-airbnb-bg-300/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Links Grid */}
        {/* TODO: Actualizar enlaces cuando las páginas estén creadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-airbnb-text-100 mb-4">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-airbnb-text-100 mb-4">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-airbnb-text-100 mb-4">Host</h3>
            <ul className="space-y-3">
              {footerLinks.host.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-airbnb-text-100 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-airbnb-bg-300/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo and Copyright */}
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-airbnb-primary-100" />
              <span className="text-airbnb-text-200 text-sm">
                © 2024 Airbnb, Inc. All rights reserved
              </span>
            </div>

            {/* Social Links */}
            {/* FIXME: Agregar enlaces reales a redes sociales */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors">
                Privacy
              </a>
              <span className="text-airbnb-bg-300">·</span>
              <a href="#" className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors">
                Terms
              </a>
              <span className="text-airbnb-bg-300">·</span>
              <a href="#" className="text-airbnb-text-200 hover:text-airbnb-primary-100 transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
