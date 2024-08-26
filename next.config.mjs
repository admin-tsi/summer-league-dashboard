/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cdn.nba.com",
      "summer-league-storage.s3.eu-north-1.amazonaws.com",
      "cdn.pixabay.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "summer-league-backend-staging.up.railway.app",
        pathname: "/uploads/players/profiles/**",
      },
    ],
  },
};

export default nextConfig;
