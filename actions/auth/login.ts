"use server"

import { loginSchema } from "@/schemas/auth"
import { getUserByEmail } from "@/data/user"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"


import * as z from "zod"
import { AuthError } from "next-auth"
import { signIn } from "@/auth"

export async function login(values: z.infer<typeof loginSchema>, callbackUrl?: string | null) {
   const validateFields = loginSchema.safeParse(values)

   if (!validateFields.success) {
      return { error: "Invalid fields" }
   }
   const { email, password } = validateFields.data

   const existingUser = await getUserByEmail(email)

   if (!existingUser) {
      return { error: "Email doesn't exist!" }
   }

   // TODO: Check email is verified and send email to verified user email
   try {
      const redirectUrl = await signIn("credentials", {
         email,
         password,
         redirect: false,
         redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      })
      if (redirectUrl) {
         return {
            redirect: redirectUrl,
         }
      }
   } catch (error) {
      if (error instanceof AuthError) {
         switch (error.type) {
            case "CredentialsSignin":
               return { error: "Invalid credentials!" }
            default:
               return { error: "Something went wrong!" }
         }
      }
   }
}
