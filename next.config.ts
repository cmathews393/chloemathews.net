import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["192.168.1.216"],
    // PostHog API paths use trailing slashes
    skipTrailingSlashRedirect: true,
    // Proxy PostHog through our own domain so ad blockers don't drop events
    async rewrites() {
        return [
            {
                source: "/ingest/static/:path*",
                destination: "https://us-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/ingest/:path*",
                destination: "https://us.i.posthog.com/:path*",
            },
        ];
    },
};
export default nextConfig;
