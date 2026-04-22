/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'via.placeholder.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  // Required for react-leaflet SSR
  transpilePackages: ['react-leaflet'],
}

module.exports = nextConfig
