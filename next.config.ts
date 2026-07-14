import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow the higher-fidelity quality used for the full-screen hero photo.
    // Next.js 16 requires each non-default quality to be allowlisted.
    qualities: [75, 90],
  },
};

export default nextConfig;
