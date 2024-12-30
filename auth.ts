import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthConfig } from "next-auth"
import credentials from "next-auth/providers/credentials"

import { db } from "@/lib/db"
import { loginSchema } from "@/schemas/auth"
// import { getAccountByUserId } from "@/data/account"
import { getUserByEmail, getUserById } from "@/data/user"
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes"

const credentialsConfig = credentials({
   async authorize(credentials) {
      const validateFields = loginSchema.safeParse(credentials)

      if (validateFields.success) {
         const { email, password } = validateFields.data

         const user = await getUserByEmail(email)
         if (!user || !user.password) return null

         const passwordMatch = await bcrypt.compare(password, user.password)
         if (passwordMatch) return user
      }

      return null
   },
})

const config = {
   pages: {
      signIn: "/",
   },
   providers: [credentialsConfig],
   callbacks: {
      authorized({ request, auth }) {
         const { pathname } = request.nextUrl
         const isLoggedIn = !!auth

         const isApiAuthRoute = pathname.startsWith(apiAuthPrefix)
         const isAuthRoute = authRoutes.includes(pathname)
         const isPublicRoute = publicRoutes.includes(pathname)

         if (isApiAuthRoute) return true

         if (isAuthRoute) {
            if (isLoggedIn) return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl))
            return true
         }

         if (!isPublicRoute) return isLoggedIn

         return true
      },
      async session({ session, token }: any) {
         if (token.sub && session.user) {
            session.user.id = token.sub
         }
         if (token.locationId && session.user) {
            // session.user.locationId = token.locationId
            session.user.name = token.name
            session.user.email = token.email
            // session.user.isOAuth = token.isOAuth
         }

         return session
      },
      async jwt({ token }) {
         if (!token.sub) return token

         const existingUser = await getUserById(token.sub)
         if (!existingUser) return token

         // const existingAccount = await getAccountByUserId(existingUser.id)
         // token.isOAuth = !!existingAccount
         token.name = existingUser.name
         token.email = existingUser.email
         // token.locationId = existingUser.locationId

         return token
      },
   },
   events: {
      async linkAccount(data) {
         await db.user.update({
            where: { id: data.user.id },
            data: { emailVerified: new Date() },
         })
      },
   },
   session: {
      strategy: "jwt",
      maxAge: 8 * 60 * 60
   },
   adapter: PrismaAdapter(db),
   trustHost: true,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
