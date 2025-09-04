/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    API_TIMEOUT: process.env.API_TIMEOUT,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.BACKEND_URL}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
