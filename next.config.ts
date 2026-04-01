import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // scripts: self + Next.js inline chunks + Mapbox
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.mapbox.com https://events.mapbox.com",
      // styles: self + inline (Tailwind/Framer) + Google Fonts + Mapbox
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com",
      // fonts
      "font-src 'self' https://fonts.gstatic.com data:",
      // images: self + Supabase storage + simpleicons CDN + postimg (map marker) + data URIs + blob
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://cdn.simpleicons.org https://api.mapbox.com https://events.mapbox.com https://i.postimg.cc",
      // connections: self + Supabase + Groq + Upstash + Mapbox
      "connect-src 'self' https://*.supabase.co https://*.supabase.in https://api.groq.com https://*.upstash.io https://api.mapbox.com https://events.mapbox.com wss://*.supabase.co",
      // workers for Mapbox GL
      "worker-src 'self' blob:",
      "child-src blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
