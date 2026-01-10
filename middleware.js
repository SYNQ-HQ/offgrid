import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admindashboard") || req.nextUrl.pathname.startsWith("/adminmerch");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return null;
    }

    if (isAdminPage) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      async authorized() {
        return true; // We handle redirection logic inside function above
      },
    },
  }
);

export const config = {
  matcher: [
    "/admindashboard/:path*",
    "/adminmerch/:path*",
    "/userprofile/:path*",
    "/login",
    "/register",
  ],
};
