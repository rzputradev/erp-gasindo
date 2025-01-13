/** @type {import('next').NextConfig} */
const nextConfig = {
   // images: {
   //    localPatterns: [
   //       {
   //          pathname: 'public/**',
   //          search: '',
   //       },
   //    ],
   // },
   experimental: {
      serverActions: {
         bodySizeLimit: '2mb'
      },
      authInterrupts: true
   },
   transpilePackages: ['geist']
};

module.exports = nextConfig;
