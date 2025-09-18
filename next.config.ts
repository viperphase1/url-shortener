import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // forward all unmatched routes to the redirect function so we don't need a second path fragment on shortened urls
    async rewrites() {
        return [
            {
                source: '/:id*',
                destination: '/api/:id*',
            },
        ];
    }
};

export default nextConfig;
