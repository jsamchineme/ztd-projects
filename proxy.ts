// Node.js runtime – admin auth guard using the standalone auth config.
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export function proxy(request: Request) {
  const url = new URL(request.url);

  // Allow the login page to render without a redirect loop.
  if (url.pathname === "/admin/login") {
    return;
  }

  return auth(request as never);
}

export const config = {
  matcher: ["/admin/:path*"],
};
