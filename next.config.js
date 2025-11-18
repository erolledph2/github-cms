/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    runtime: 'nodejs',
  },
};

module.exports = nextConfig;
