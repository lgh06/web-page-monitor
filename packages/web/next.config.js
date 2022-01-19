/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    urlImports: [
      'https://cdn.jsdelivr.net/npm/@monaco-editor/react/+esm',
      'https://cdn.jsdelivr.net/npm/@monaco-editor/loader@1.2.0/+esm',
      'https://cdn.jsdelivr.net/npm/react@17.0.2/+esm',
      'https://cdn.jsdelivr.net/npm/prop-types@15.8.1/+esm',
      'https://cdn.jsdelivr.net/npm/state-local@1.0.7/+esm',
    ],
  },
  // webpack: (config) => {
  //   config.module.rules.push({
  //     test: /\.d\.ts$/,
  //     use: 'raw-loader',
  //   });
  //   return config;
  // },
}

module.exports = nextConfig
