/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',          // self-contained server for the Docker image on the VPS
  poweredByHeader: false,
  serverExternalPackages: ['pg', '@electric-sql/pglite'],
};
export default nextConfig;
