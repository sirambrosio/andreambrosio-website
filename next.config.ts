import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;
