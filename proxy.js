import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/profile", req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url),
      );
    }

    // Role-based protection for /admin
    if (
      req.nextUrl.pathname.startsWith("/admin") ||
      req.nextUrl.pathname.startsWith("/admindashboard")
    ) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url)); // Redirect non-admins to home
      }
    }

    return null;
  },
  {
    callbacks: {
      async authorized() {
        // We return true here so the middleware function above can handle the logic.
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/admindashboard/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
