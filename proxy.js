import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

import { NextResponse } from 'next/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher([
    '/cart(.*)',
    '/orders(.*)',
    '/store(.*)',
    '/admin(.*)',
]);

const middleware = clerkMiddleware(async (auth, req) => {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";
    const adminDomain = "api.admin.binarycomputers.shop";
    const path = url.pathname;

    if (hostname === adminDomain) {
        // Exclude API and Clerk routes from being rewritten to /admin
        if (!path.startsWith("/admin") && !path.startsWith("/api") && !path.startsWith("/__clerk")) {
            const newPath = path === "/" ? "/admin" : `/admin${path}`;
            // Protect since it maps to /admin
            await auth.protect();
            return NextResponse.rewrite(new URL(newPath, req.url));
        }
    }

    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export function proxy(request, event) {
    return middleware(request, event);
}

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
