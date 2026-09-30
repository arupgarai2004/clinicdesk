import type { NextConfig } from 'next';

const apiOrigin = process.env.API_BASE_URL ?? 'http://localhost:3333';

const nextConfig: NextConfig = {
  transpilePackages: ['@org/models'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;