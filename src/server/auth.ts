import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import bcrypt from "bcrypt"
import { PrismaClient } from '@prisma/client'
import { User as ModelUser, UserRole, newUserRole } from "~/features/user/models";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: ModelUser & DefaultSession["user"]
  }
  interface User extends ModelUser { }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    roles?: UserRole[]
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user, token }) {
      const u = { ...user }

      if (token?.userId) {
        u.id = token.userId
      }
      if (token?.roles) {
        u.roles = token.roles
      }

      return {
        ...session,
        user: {
          ...session.user,
          ...u,
        },
      }
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.userId = user.id
        token.roles = user.roles
      }

      return token
    },

  },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "id", type: "text", placeholder: "user id" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username) return null
        const prisma = new PrismaClient()
        const user = await prisma.user.findFirst({
          where: {
            id: credentials.username,
          },
          include: {
            userPassword: {
              select: {
                hashedPassword: true
              }
            },
            userRoles: {
              select: {
                name: true
              }
            }
          }
        })
        if (!user || !user.userPassword?.hashedPassword) return null
        const m = await bcrypt.compare(credentials.password, user.userPassword.hashedPassword)
        if (m) {
          const u: ModelUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.userRoles.map(r => newUserRole(r.name)).filter(r => r !== null).map(r => r as UserRole)
          }
          console.log("login success", user.userRoles);

          return u
        }
        return null
      }
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
