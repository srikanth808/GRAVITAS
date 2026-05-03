import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/pdf-parse/**/*'],
    },
  },
};

export default nextConfig;
