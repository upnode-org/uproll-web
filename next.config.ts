import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Any request to /docker-hub/* will be forwarded to Docker Hub
        source: "/docker-hub/:path*",
        destination: "https://hub.docker.com/:path*",
      },
    ];
  },
};

export default nextConfig;
