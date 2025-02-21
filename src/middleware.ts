import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { env } from "./env";
import { NextRequest, NextResponse } from "next/server";
import { WIX_SESSION_COOKIE } from "./lib/constants";

const wixClient = createClient({
  auth: OAuthStrategy({
    clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID,
  }),
});

export async function middleware(request: NextRequest) {
  // Handle static routes and api routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  const cookies = request.cookies;
  const sessionCookie = cookies.get(WIX_SESSION_COOKIE);

  let sessionTokens: Tokens;

  try {
    if (sessionCookie) {
      sessionTokens = JSON.parse(sessionCookie.value) as Tokens;

      // Check if token is expired or about to expire (within 5 minutes)
      const isExpired =
        sessionTokens.accessToken.expiresAt < Math.floor(Date.now() / 1000);
      const isExpiringSoon =
        sessionTokens.accessToken.expiresAt <
        Math.floor(Date.now() / 1000) + 300;

      if (isExpired || isExpiringSoon) {
        try {
          sessionTokens = await wixClient.auth.renewToken(
            sessionTokens.refreshToken,
          );
        } catch (error) {
          console.error("Token renewal failed:", error);
          sessionTokens = await wixClient.auth.generateVisitorTokens();
        }
      }
    } else {
      sessionTokens = await wixClient.auth.generateVisitorTokens();
    }
  } catch (error) {
    console.error("Session handling error:", error);
    sessionTokens = await wixClient.auth.generateVisitorTokens();
  }

  // Create the response
  const response = NextResponse.next();

  // Set the cookie with proper options
  response.cookies.set(WIX_SESSION_COOKIE, JSON.stringify(sessionTokens), {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  });

  // Add headers to indicate dynamic content
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  response.headers.set("Vary", "Cookie");

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and images
    "/((?!_next/static|_next/image|favicon.ico|public/.*|api/auth/.*|assets/.*|robots.txt).*)",
  ],
};
