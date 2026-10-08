import type { NextConfig } from "next";
import { defaultLandingLocale, landingEntryPath, landingPath } from './src/lib/landing';

const nextConfig: NextConfig = {
  async redirects() {
    return [{
      source: landingEntryPath,
      destination: landingPath(defaultLandingLocale),
      permanent: false,
    }];
  },
  images: {
    // Allow SVG placeholders in development; replace with real images in production
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
