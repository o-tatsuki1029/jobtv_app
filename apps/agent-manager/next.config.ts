import type { NextConfig } from "next";

// Extend NextConfig type to include turbopackUseSystemTlsCerts
interface ExtendedNextConfig extends NextConfig {
  experimental?: NextConfig["experimental"] & {
    turbopackUseSystemTlsCerts?: boolean;
  };
}

const nextConfig: ExtendedNextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;
