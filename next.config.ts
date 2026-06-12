import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/assets/:path*",
        destination: "http://localhost:3012/assets/:path*",
      },
      {
        source: "/OnlineImages/:path*",
        destination: "http://localhost:3012/OnlineImages/:path*",
      }
    ];
  },

  reactStrictMode: false,
};

export default nextConfig;