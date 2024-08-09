/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.nba.com", "summer-league-backend-staging.up.railway.app"],
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
