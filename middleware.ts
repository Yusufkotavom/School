import { NextRequest, NextResponse } from "next/server";
import {
  AFTER_LOGIN_URL,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

export default async function middleware(req: NextRequest) {
  try {
    const { nextUrl } = req;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // Get the token from the session
    const token = req.cookies.get("next-auth.session-token")?.value || 
                  req.cookies.get("__Secure-next-auth.session-token")?.value;

    const isLoggedIn = !!token;

    if (isApiAuthRoute) {
      return null;
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(AFTER_LOGIN_URL, nextUrl));
      }
      return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
      return Response.redirect(new URL(`/auth/login`, nextUrl));
    }

    return null;
  } catch (error) {
    console.error("Middleware error:", error);
    // Fallback: allow the request to proceed
    return null;
  }
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/admin",
    "/teacher",
  ],
};


