import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://js.stripe.com https://your-allowed-scripts.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://res.cloudinary.com https://i.ytimg.com https://*.stripe.com;
      frame-src https://www.google.com https://js.stripe.com;
      connect-src 'self' https://api.cloudinary.com https://api.stripe.com;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, " "), // clean up extra spaces
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
];



const nextConfig: NextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.CLOUDINARY_DOMAIN || "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)", // applies to all routes
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
