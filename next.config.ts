import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /api/kana-convert loads kuromoji's dictionary from node_modules at
  // runtime (see src/lib/kana-convert.ts) via a plain fs path rather than an
  // import, so Next's file tracer can't discover it on its own — without
  // this, the dict is missing from the deployed Vercel function and the
  // route 500s in production.
  outputFileTracingIncludes: {
    "/api/kana-convert": ["./node_modules/kuromoji/dict/**/*"],
  },
};

export default nextConfig;
