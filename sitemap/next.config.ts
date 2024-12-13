import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  webpack(config, { isServer }) {
    if (isServer) {
      require('./scripts/generate-sitemap.js');
    }

    return config;
  },
};

export default nextConfig;
