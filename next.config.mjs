/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@electric-sql/pglite"],
  },
  webpack: (config, { isServer }) => {
    // For PGlite WASM loading in server context
    if (isServer) {
      config.externals.push("@electric-sql/pglite");
    }
    return config;
  },
};

export default nextConfig;
