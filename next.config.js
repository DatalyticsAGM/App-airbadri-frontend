/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Permitir rutas dinámicas en modo estático
  trailingSlash: true,
};

module.exports = nextConfig;
