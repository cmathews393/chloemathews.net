import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["img.icons8.com"],
  },
  async redirects() {
    return [
      {
        source: "/nogimmick",
        destination: "/",
        permanent: true,
      },
      {
        source: "/nogimmick/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
