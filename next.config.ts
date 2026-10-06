import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  webpack(config) {
    // Keep the chart primitives and examples on the same engine instance.
    config.resolve.alias.recharts = path.resolve(__dirname, "node_modules/recharts");
    return config;
  },
};

export default config;
