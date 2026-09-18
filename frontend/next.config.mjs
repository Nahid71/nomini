/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.BACKEND_INTERNAL_URL || 'http://localhost:4000'}/api/v1/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${process.env.BACKEND_INTERNAL_URL || 'http://localhost:4000'}/uploads/:path*`,
      },
      {
        source: '/api/docs/:path*',
        destination: `${process.env.BACKEND_INTERNAL_URL || 'http://localhost:4000'}/api/docs/:path*`,
      },
    ];
  },
};

export default nextConfig;
