/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removido - no compatible con autenticación y API dinámica
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
