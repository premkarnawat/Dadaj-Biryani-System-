/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation errors — pages are rendered dynamically at runtime
  // so env vars are available when the user actually visits
  experimental: {},
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
