import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: [process.env.CLOUDINARY_DOMAIN || 'res.cloudinary.com'],
  },
};

export default nextConfig;
