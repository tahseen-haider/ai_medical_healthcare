import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.CLOUDINARY_DOMAIN || 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
};

export default nextConfig;
