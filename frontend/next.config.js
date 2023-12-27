/** @type {import('next').NextConfig} */
const nextConfig = () => {
     const rewrites = () => {
          return [
               {
                    source: '/api/:path*',
                    destination: 'https://nasahunchapi.onrender.com/:path*',
               },
          ];
     };
     return {
          rewrites,
     };
};

module.exports = nextConfig;
