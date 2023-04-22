/** @type {import('next').NextConfig} */
// const nextConfig = withPWA({
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     remotePatterns: [
//       { protocol: 'https', hostname: 'cas-fee-advanced-ocvdad.zitadel.cloud' },
//       {
//         protocol: 'https',
//         hostname: 'storage.googleapis.com',
//         pathname: '/qwacker-api-prod-data/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'picsum.photos',
//       },
//     ],
//   },
// });

const withPWA = require('next-pwa')({
  dest: 'public',
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
