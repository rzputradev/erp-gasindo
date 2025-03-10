'use server';

import { loginSchema } from '@/lib/schemas/auth';
import { getUserByEmail } from '@/data/user';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

import * as z from 'zod';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { UserStatus } from '@prisma/client';

export async function login(
   values: z.infer<typeof loginSchema>,
   callbackUrl?: string | null
) {
   const validateFields = loginSchema.safeParse(values);

   if (!validateFields.success) {
      return { error: 'Data tidak valid' };
   }
   const { email, password } = validateFields.data;

   const existingUser = await getUserByEmail(email);

   if (!existingUser) {
      return { error: 'Email tidak ditemukan' };
   }

   if (!existingUser.emailVerified) {
      return { error: 'Email belum terkonfirmasi' };
   }

   if (existingUser.status === UserStatus.SUSPENDED) {
      return { error: `Akun anda sedang Ditangguhkan` };
   }

   if (existingUser.status === UserStatus.BLOCKED) {
      return { error: `Akun anda sudah Diblokir` };
   }

   // TODO: Check email is verified and send email to verified user email
   try {
      const redirectUrl = await signIn('credentials', {
         email,
         password,
         redirect: false,
         redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
      });
      if (redirectUrl) {
         return {
            redirect: redirectUrl
         };
      }
   } catch (error) {
      if (error instanceof AuthError) {
         switch (error.type) {
            case 'CredentialsSignin':
               return { error: 'Invalid credentials!' };
            default:
               return { error: 'Something went wrong!' };
         }
      }
   }
}
