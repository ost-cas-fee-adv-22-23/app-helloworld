const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cas-fee-advanced-ocvdad.zitadel.cloud' },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/qwacker-api-prod-data/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
})
