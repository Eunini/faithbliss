/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcFileReading: false,
    swcMinify: false,
    swcPlugins: [],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig