import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "debbskitchen.ztddevs.com" },
    ],
  },
  experimental: {
    serverActions: {
      // Studio's proxy forwards requests with the Origin rewritten to the
      // internal address, which Next's server-action CSRF check would reject.
      allowedOrigins: [
        "debbskitchen.ztddevs.com",
        `localhost:${process.env.PORT || 4402}`,
        `127.0.0.1:${process.env.PORT || 4402}`,
      ],
    },
  },
  reactStrictMode: true,
  compress: true,
  async headers() {
    return [
      {
        source: "/:path*{/}?",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Accel-Buffering", value: "no" },
        ],
      },
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
