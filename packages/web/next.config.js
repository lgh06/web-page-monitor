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
  // webpack: (config) => {
  //   config.externals = [
  //     ...config.externals,
  //     'mongodb',
  //   ]
  //   return config;
  // },
}

module.exports = nextConfig
