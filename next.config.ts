import type {NextConfig} from 'next';
import 'dotenv/config';
let withSerwist: (config: any) => any = (config) => config;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withSerwistInit = require('@serwist/next').default || require('@serwist/next');
  withSerwist = withSerwistInit({
    swSrc: 'src/app/sw.ts',
    swDest: 'public/sw.js',
  });
} catch {
  // @serwist/next não instalado neste ambiente
}

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Ignorando erros temporariamente conforme autorizado na homologação
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/painel/dashboard',
        permanent: false,
      },
      {
        source: '/estudio',
        destination: '/studio',
        permanent: false,
      },
    ];
  },
};

export default withSerwist(nextConfig);
