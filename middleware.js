import { NextResponse } from "next/server";

export function middleware(request) {
  // Create a new response
  const response = NextResponse.next();

  // Add CORS headers to the response
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

// Apply middleware only to /api routes
export const config = {
  matcher: "/api/:path*",
};
