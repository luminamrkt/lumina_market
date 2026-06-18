import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/lumina_market",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
