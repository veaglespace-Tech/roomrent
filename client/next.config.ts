import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  async rewrites() {
    const backendOrigin = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api").replace(/\/api\/?$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
