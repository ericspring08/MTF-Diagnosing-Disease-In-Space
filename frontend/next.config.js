/** @type {import('next').NextConfig} */
const nextConfig = () => {
  const rewrites = () => {
    return [
      {
        source: '/api/:path*',
        destination: 'https://nasahunchapi.onrender.com/:path*',
        // destination: 'http://127.0.0.1:8000/:path*',
      },
    ];
  };
  return {
    rewrites,
  };
};

module.exports = nextConfig;
