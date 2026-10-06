import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  turbopack: { root: path.resolve(__dirname, "..") },
  webpack(config) {
    // Local file dependencies must share the chart engine's React contexts.
    config.resolve.alias.recharts = path.resolve(__dirname, "node_modules/recharts");
    return config;
  },
};

export default config;
