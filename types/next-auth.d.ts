import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
   type UserSession = DefaultSession['user'];
   interface Session {
      user: UserSession;
   }

   interface User {
      location?: string;
      role?: string;
      permissions?: string[];
   }

   interface CredentialsInputs {
      email: string;
      password: string;
   }
}
