/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        unoptimized: true
    },
    env: {
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "sk_test_aDTvGHXAx0llwqHbDJ0DNX9FC4JpXvlFCMTNPZc3Yz",
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_ZGVjaWRpbmctZG9nZmlzaC00MC5jbGVyay5hY2NvdW50cy5kZXYk",
    }
};

export default nextConfig;
