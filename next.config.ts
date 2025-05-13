import type { NextConfig } from "next";
import nextra from "nextra";

const withNextra = nextra({
  contentDirBasePath: "/docs",
  readingTime: true,
});

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

export default withNextra(nextConfig);
