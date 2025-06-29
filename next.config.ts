/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/bms_web',
  assetPrefix: '/bms_web/',
}

module.exports = nextConfig
