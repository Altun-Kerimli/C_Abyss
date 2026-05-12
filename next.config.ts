/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Allows large batch image uploads
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'envglhziclgututdssjz.supabase.co', // Your Supabase bucket
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // To allow dummy data covers
      }
    ],
  },
};

export default nextConfig;