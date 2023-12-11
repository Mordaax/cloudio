/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'Deny',
          },
          {
            key: 'X-XSS-Protection',
            value: '0',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'no-sniff',
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
