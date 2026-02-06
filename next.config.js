/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removido - no compatible con autenticación y API dinámica
  output: 'standalone', // Para Docker: genera build optimizado con solo archivos necesarios
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
