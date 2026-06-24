import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher([
    '/cart(.*)',
    '/orders(.*)',
    '/store(.*)',
    '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
}, {
    secretKey: process.env.CLERK_SECRET_KEY || "sk_test_aDTvGHXAx0llwqHbDJ0DNX9FC4JpXvlFCMTNPZc3Yz",
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_ZGVjaWRpbmctZG9nZmlzaC00MC5jbGVyay5hY2NvdW50cy5kZXYk"
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
        // Always run for Clerk-specific frontend API routes
        '/__clerk/(.*)',
    ],
};
