import { z } from "zod"

export const loginSchema = z.object({
   email: z.string().email({ message: "Email is invalid" }),
   password: z.string().min(1, { message: "Password is required" }),
})

export const RegisterSchema = z.object({
   name: z.string().min(1, { message: "Name is required" }),
   email: z.string().email({ message: "Email is invalid" }),
   password: z.string().min(6, { message: "Password is too short" }),
   confirm_password: z.string().min(1, { message: "Confirm password id required" })
}).refine(
   (data) => {
      if (data.confirm_password != data.password) {
         return false
      }
      return true
   }, { message: "Password and confirm password do not match!" }
)

export const SettingSchema = z
   .object({
      name: z.optional(z.string().min(1, { message: "Name field can't be empty" })),
      email: z.optional(z.string().email()),
      password: z.optional(z.string().min(1, { message: "password field can't be empty" })),
      newPassword: z.optional(z.string().min(5)),
   })
   .refine(
      (data) => {
         if (data.password && !data.newPassword) {
            return false
         }
         return true
      },
      { message: "New password is required!", path: ["newPassword"] }
   )
   .refine(
      (data) => {
         if (!data.password && data.newPassword) {
            return false
         }
         return true
      },
      { message: "Password is required", path: ["password"] }
   )
