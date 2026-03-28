import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow SVG placeholders in development; replace with real images in production
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
