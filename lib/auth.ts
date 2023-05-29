import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { DefaultSession, NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import { prisma } from "./db/db"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession["user"]
  }

  // interface User {
  // }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/signin",
  },
}
