import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
   title: 'Authentication',
   description: 'Authentication forms built using the components.'
};

export default function SignInViewPage() {
   return (
      <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
         <Link
            href="/examples/authentication"
            className={cn(
               buttonVariants({ variant: 'ghost' }),
               'absolute right-4 top-4 hidden md:right-8 md:top-8'
            )}
         >
            Login
         </Link>
         <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900" />
            {/* Logo */}
            <div className="relative z-20 flex items-center text-lg font-medium">
               <Logo
                  url="/"
                  height={64}
                  width={64}
                  short={false}
                  title_classname="text-xl font-semibold"
                  sub_title_classname="text-sm"
               />
            </div>
            <div className="relative z-20 mt-auto">
               <blockquote className="space-y-2">
                  <p className="text-lg">
                     &ldquo;Menjadi Perusahaan berwawasan nasional yang
                     bereputasi baik, berkontribusi membangun Indonesia dan
                     meningkatkan kesejahteraan masyarakat dengan tetap menjaga
                     lingkungan hidup.&rdquo;
                  </p>
                  <footer className="text-sm">
                     PT. Garuda Sakti Nusantara Indonesia
                  </footer>
               </blockquote>
            </div>
         </div>
         <div className="flex h-full items-center p-4 lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
               <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                     Login
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     Silahkan masukkan email dan password anda
                  </p>
               </div>
               <UserAuthForm />
               <p className="px-8 text-center text-sm text-muted-foreground">
                  Dengan mengklik lanjut, Anda setuju dengan{' '}
                  <Link
                     href="/terms"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Terms of Service
                  </Link>{' '}
                  dan{' '}
                  <Link
                     href="/privacy"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Privacy Policy
                  </Link>{' '}
                  kami.
               </p>
            </div>
         </div>
      </div>
   );
}
