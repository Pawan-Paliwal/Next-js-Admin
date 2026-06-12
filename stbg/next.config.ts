import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl: string = process.env.INTERNAL_ASSETS_ORIGIN || "http://localhost:3011";

    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      {
        source: "/assets/:path*",
        destination: `${apiUrl}/assets/:path*`,
      },
      {
        source: "/OnlineImages/:path*",
        destination: `${apiUrl}/OnlineImages/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/app-tnc",
        destination: "/terms-of-use",
        permanent: true
      },
    ];
  },

  reactStrictMode: false,
};

export default nextConfig;