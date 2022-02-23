/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // next export
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

// if static export, then disable i18n
if(process.env.NEXT_PUBLIC_export_lang){
  delete nextConfig.i18n;
}

module.exports = nextConfig
