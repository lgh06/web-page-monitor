/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
  // experimental: {

  // },
  webpack: (config) => {
    config.experiments.topLevelAwait = true;
    return config;
  },
}

module.exports = nextConfig
