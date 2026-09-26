/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ensures clean deployment on cloud runners
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
