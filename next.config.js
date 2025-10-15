/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone', // يخلي Vercel يبني مع دعم API
};

module.exports = nextConfig;