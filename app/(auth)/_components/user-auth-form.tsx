'use client';
import { Button } from '@/components/ui/button';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
// import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
// import GithubSignInButton from './github-auth-button';
import { loginSchema } from '@/lib/schemas/auth';
import { login } from '@/actions/auth/login';
import { FormError } from '@/components/form-error';

const formSchema = z.object({
   email: z.string().email({ message: 'Enter a valid email address' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
   const [error, setError] = useState<string | undefined>(undefined);
   const searchParams = useSearchParams();
   const callbackUrl = searchParams.get('callbackUrl');
   const [loading, startTransition] = useTransition();
   const router = useRouter();

   const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: '',
         password: ''
      }
   });

   const onSubmit = async (values: z.infer<typeof loginSchema>) => {
      setError(undefined);

      startTransition(async () => {
         const res = await login(values, callbackUrl);
         form.reset();

         if (res?.error) {
            setError(res.error);
            toast.error(res.error);
         }
         if (res?.redirect) {
            toast.success('Login successfull');
            router.push(res?.redirect);
         }
      });
   };

   return (
      <>
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="w-full space-y-4"
            >
               <div className="space-y-2">
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input
                                 type="email"
                                 placeholder="example@mail.com"
                                 disabled={loading}
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <Input
                                 type="password"
                                 placeholder="********"
                                 disabled={loading}
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <FormError message={error!} />
               <Button
                  disabled={loading}
                  className="ml-auto w-full"
                  type="submit"
               >
                  Lanjutkan
               </Button>
            </form>
         </Form>
         {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GithubSignInButton /> */}
      </>
   );
}
