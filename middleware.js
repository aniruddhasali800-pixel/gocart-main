import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  
  // The super admin domain
  const adminDomain = "api.admin.binarycomputers.shop";

  const path = url.pathname;

  // 1. If the user is visiting the admin domain
  if (hostname === adminDomain) {
    // If they visit the root of the admin domain, rewrite to show the /admin section automatically
    if (path === "/") {
      return NextResponse.rewrite(new URL("/admin", request.url));
    }
    // Allow everything else on the admin domain (like /admin/dashboard)
    return NextResponse.next();
  }

  // 2. If the user is on a REGULAR domain (like binarycomputers.shop)
  if (hostname !== adminDomain) {
    // Block any attempt to access the /admin paths
    if (path.startsWith("/admin")) {
      // Redirect unauthorized attempts back to the home page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Apply this middleware to all routes except static files and images
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
