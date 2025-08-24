import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

// Simplified auth config for middleware (no bcryptjs to avoid Edge Runtime issues)
export default {
  providers: [],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ token, session }) {
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;