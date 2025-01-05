/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
      serverActions: {
         bodySizeLimit: '2mb'
      }
   },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'utfs.io',
            port: ''
         },
         {
            protocol: 'https',
            hostname: 'api.slingacademy.com',
            port: ''
         }
      ]
   },
   transpilePackages: ['geist']
};

module.exports = nextConfig;
