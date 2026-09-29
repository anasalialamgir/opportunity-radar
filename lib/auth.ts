import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
        });
        return user?.passwordHash && await verifyPassword(credentials.password, user.passwordHash) ? user : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sessionVersion = (user as any).sessionVersion || 0;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const user = token.sub && await prisma.user.findUnique({ where: { id: token.sub }, select: { sessionVersion: true } });
        if (user && user.sessionVersion === (token.sessionVersion ?? 0)) (session.user as any).id = token.sub;
        else session.user = undefined as any;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
