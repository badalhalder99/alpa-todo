import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pioneer-alpha-website-django-s3-bucket-new-2.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'todo-app.pioneeralpha.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
};

export default nextConfig;
