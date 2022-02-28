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
  async headers(){
    return [
      {
        source: '/:path*', // automatically handles all locales
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=3600',
          },
        ],
      },
      {
        // index page
        source: '/',
        locale: false,
        headers: [
          {
           key: 'Cache-Control',
           value: 'no-store',
          },
        ],
      }
    ]
  },
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
// if basePath, then add
if(process.env.NEXT_PUBLIC_basePath){
  nextConfig.basePath = process.env.NEXT_PUBLIC_basePath;
}

module.exports = nextConfig
