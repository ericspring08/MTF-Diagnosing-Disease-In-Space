/** @type {import('next').NextConfig} */
const nextConfig = () => {
  const rewrites = () => {
    return [
      {
        source: '/api/:path*',
        destination: 'https://nasahunchapi.onrender.com/:path*',
        // destination: 'http://127.0.0.1:5000/:path*',
      },
    ];
  };
  return {
    rewrites,
    experimental: {
      serverComponentsExternalPackages: ['@react-pdf/renderer'],
    }
  };
};

module.exports = nextConfig;
