import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const authConfig: NextAuthConfig = {
  // Studio serves the app behind its own proxy (debbskitchen.ztddevs.com), so
  // trust the forwarded host; without this every auth request fails with
  // "UntrustedHost".
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as "ADMIN" | "EDITOR" | "AUTHOR";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "EDITOR" | "AUTHOR";
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role as
        | "ADMIN"
        | "EDITOR"
        | "AUTHOR"
        | undefined;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      const adminOnlyRoutes = ["/admin/users"];
      const isAdminOnlyRoute = adminOnlyRoutes.some((route) =>
        nextUrl.pathname.startsWith(route),
      );

      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }

      if (isAdminRoute) {
        if (!isLoggedIn) {
          const loginUrl = new URL("/admin/login", nextUrl);
          loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
          return Response.redirect(loginUrl);
        }
        if (isAdminOnlyRoute && userRole !== "ADMIN") {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        if (!email || !password) return null;

        const user = await prisma.user.findFirst({
          where: { email: { equals: email.trim(), mode: "insensitive" } },
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
};
