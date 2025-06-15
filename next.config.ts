import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/norruva.firebasestorage.app/o/**',
      },
    ],
  },
  allowedDevOrigins: [
    // Update to match the current error message
    'https://6000-firebase-studio-1749829808591.cluster-axf5tvtfjjfekvhwxwkkkzsk2y.cloudworkstations.dev',
    // Keep the old one if you might switch back
    'https://9003-firebase-studio-1749131649534.cluster-axf5tvtfjjfekvhwxwkkkzsk2y.cloudworkstations.dev',
  ],
};

export default nextConfig;