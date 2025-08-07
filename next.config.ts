import type { NextConfig } from 'next';
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://your-allowed-scripts.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://res.cloudinary.com;
      frame-src https://www.google.com;
      connect-src 'self';
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\n/g, ''), // remove newlines
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
];

const nextConfig: NextConfig = {
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

  async headers() {
    return [
      {
        source: '/(.*)', // applies to all routes
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
