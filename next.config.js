/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'via.placeholder.com'],
  },
  // Required for react-leaflet SSR
  transpilePackages: ['react-leaflet'],
}

module.exports = nextConfig
