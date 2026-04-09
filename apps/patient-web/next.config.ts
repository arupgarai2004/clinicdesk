import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@org/models'],
};

export default nextConfig;