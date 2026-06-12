import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  
  // The super admin domain
  const adminDomain = "api.admin.binarycomputers.shop";

  const path = url.pathname;

  // 1. If the user is visiting the admin domain
  if (hostname === adminDomain) {
    // If the path doesn't already start with /admin, rewrite it to /admin/...
    // This makes the entire api.admin.binarycomputers.shop domain act as the /admin folder
    if (!path.startsWith("/admin")) {
      const newPath = path === "/" ? "/admin" : `/admin${path}`;
      return NextResponse.rewrite(new URL(newPath, request.url));
    }
    return NextResponse.next();
  }

  // Regular domain block removed as per user request
  // Users can still access /admin via the regular domain for now.

  return NextResponse.next();
}

// Apply this middleware to all routes except static files and images
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
