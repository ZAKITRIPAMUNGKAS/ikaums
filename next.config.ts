import type { NextConfig } from "next";

const scriptSrc = ["'self'", "'unsafe-inline'", ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : [])].join(' ');

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: `default-src 'self'; base-uri 'self'; frame-ancestors 'self'; object-src 'none'; img-src 'self' data: blob: https:; connect-src 'self' https:; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; script-src ${scriptSrc}` },
        ],
      },
    ];
  },
};

export default nextConfig;
