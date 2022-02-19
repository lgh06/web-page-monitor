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
    // https://github.com/vercel/next.js/issues/12557#issuecomment-994278512
    // topLevelAwait https://webpack.js.org/configuration/experiments/
    // config.experiments.topLevelAwait = true;
    return config;
  },
}

module.exports = nextConfig
