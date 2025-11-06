/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build-time environment variables (will be injected at build time)
  env: {
    API_TIMEOUT: process.env.API_TIMEOUT,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
  },

  // Use assetPrefix to prefix all static assets and internal API routes
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '/netcdfaster-frontend',

  async rewrites() {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/netcdfaster-frontend';

    return {
      beforeFiles: [
        // Rewrite /<basePath>/* to /* for routing
        // This allows both paths to work: /netcdfaster-frontend/page and /page
        ...(basePath ? [
          {
            source: `${basePath}/:path*`,
            destination: '/:path*',
          },
        ] : []),
      ],
    }
  },
}

module.exports = nextConfig
