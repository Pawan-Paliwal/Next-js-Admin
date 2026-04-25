import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/assets/:path*",
        destination: "http://localhost:3012/assets/:path*",
      },
      {
        source: "/OnlineImages/:path*",
        destination: "http://localhost:3012/OnlineImages/:path*",
      },
    ];
  },

  reactStrictMode: false,
};

export default nextConfig;