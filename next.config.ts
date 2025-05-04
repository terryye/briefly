import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["*.teninno.com", "localhost:3000"],
    images: {
        remotePatterns: [
            new URL("https://media.cnn.com/**"),
            new URL("https://img.daisyui.com/**"),
        ],
    },

    /* config options here */
};

export default nextConfig;
