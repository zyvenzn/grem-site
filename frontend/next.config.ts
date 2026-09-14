import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "7fb24cad-0cde-4b97-b88d-ad85794f8df0.cluster-12.preview.emergentcf.cloud",
    "goblin-tracker.cluster-12.preview.emergentcf.cloud",
    "*.cluster-12.preview.emergentcf.cloud",
    "*.preview.emergentcf.cloud",
    "*.preview.emergentagent.com",
    "*.emergentagent.com",
    "*.emergentcf.cloud",
  ],
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};

export default nextConfig;
