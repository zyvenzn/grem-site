import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Di versi ini, allowedDevOrigins ditaruh langsung di sini, bukan di dalam experimental */
  allowedDevOrigins: ['10.11.196.138', 'localhost:3000', '10.11.196.138:3000']
};

export default nextConfig;
