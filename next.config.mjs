/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Gallery uploads arrive through a server action as multipart form data;
    // the default 1 MB would refuse any real screenshot.
    serverActions: { bodySizeLimit: "12mb" },
  },
};
export default nextConfig;
