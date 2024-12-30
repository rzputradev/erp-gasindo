"use server";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas/auth";

import bcrypt from "bcryptjs";
import { z } from "zod";

export async function register(values: z.infer<typeof RegisterSchema>) {
   const registerEnabled = process.env.NEXT_PUBLIC_REGISTER === "true";

   if (!registerEnabled) {
      return { error: "Registration is currently disabled." };
   }

   // Validate input using Zod
   const validationResult = RegisterSchema.safeParse(values);
   if (!validationResult.success) {
      return {
         error: "Invalid input data",
         details: validationResult.error.format(),
      };
   }

   const { name, email, password } = validationResult.data;

   try {
      // Check if the email is already in use
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
         return { error: "Email already in use. Please try a different email." };
      }

      // Hash the user's password securely
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user in the database
      await db.user.create({
         data: {
            name,
            email,
            password: hashedPassword,
         },
      });

      // Placeholder for email verification functionality
      // TODO: Implement email verification (e.g., send verification token)
      // Example: await sendVerificationEmail(email);

      return { success: "Account created successfully. Please verify your email." };
   } catch (error) {
      console.error("Registration error:", error);

      // Return a user-friendly error message
      return { error: "An unexpected error occurred. Please try again later." };
   }
}
