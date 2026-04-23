/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
  // Optionally, add a fallback for offline pages
  fallbacks: {
    document: "/offline", // page to serve if offline
  },
});

const nextConfig = {
  async rewrites() {
    return [
      {
        // Tenant: One18 Bakery
        source: '/api/:path*',
        has: [
          {
            type: 'host',
            value: 'one18bakery-razposv2.vercel.app',
          },
        ],
        //  destination: 'https://one18bakery.frappe.cloud/api/:path*', change to real one18bakery ERPnext instance when ready
        destination: `${process.env.FRAPPE_API_URL}/api/:path*`,
      },
      {
        // This intercepts local calls to /api and proxies them to Frappe
        source: '/api/:path*',
        destination: `${process.env.FRAPPE_API_URL}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.spatuladesserts.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "razpos.s.frappe.cloud",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "razpos.s.frappe.cloud",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
    ],
    // Add more flexible handling for unknown hosts
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Override default behavior to be more permissive
    domains: [], // deprecated but might still work
    // Custom loader can help with dynamic hostnames
    loader: "default",
  },
};

module.exports = withPWA(nextConfig);
