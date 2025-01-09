'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { startTransition, useState } from 'react';
import { Gender, Location, Role, User, UserStatus } from '@prisma/client';

import { updateUserSchema } from '@/lib/schemas/user';

import { Button } from '@/components/ui/button';
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
   Card,
   CardHeader,
   CardTitle,
   CardContent,
   CardDescription
} from '@/components/ui/card';
import { FileUploader } from '@/components/file-uploader';
import { updateUser } from '@/actions/user/update';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';
import { toast } from 'sonner';
import { auth } from '@/auth';
import { signOut, useSession } from 'next-auth/react';
import {
   changePasswordSchema,
   updatePersonalSchema
} from '@/lib/schemas/setting';
import { updatePersonal } from '@/actions/setting/personal';
import { changePassword } from '@/actions/setting/change-password';

interface UpdateFormProps {
   data: User;
}

export function ChangePasswordForm({ data }: UpdateFormProps) {
   const { update } = useSession();
   const [isPending, setIspending] = useState(false);
   const [error, setError] = useState<string | undefined>(undefined);
   const [success, setSuccess] = useState<string | undefined>(undefined);

   const form = useForm<z.infer<typeof changePasswordSchema>>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: {
         id: data.id,
         old_password: '',
         password: '',
         confirm_password: ''
      }
   });

   function onSubmit(values: z.infer<typeof changePasswordSchema>) {
      setIspending(true);
      setSuccess(undefined);
      setError(undefined);
      startTransition(() => {
         changePassword(values)
            .then((res) => {
               setIspending(false);
               if (res?.error) {
                  setError(res.error);
                  toast.error(res.error);
                  form.reset();
               }
               if (res?.success) {
                  signOut();
                  setSuccess(res.success);
                  toast.success(res.success);
               }
            })
            .catch((e) => {
               form.reset();
               console.log(e);
               toast.error('Something went wrong!');
            });
      });
   }

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Ganti Password
            </CardTitle>
            <CardDescription>
               Pilih kata sandi yang kuat dan jangan menggunakannya kembali
               untuk akun lain.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
                  <FormField
                     control={form.control}
                     name="old_password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <Input
                                 type="password"
                                 placeholder="******"
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
                           <FormLabel>Password Baru</FormLabel>
                           <FormControl>
                              <Input
                                 type="password"
                                 placeholder="******"
                                 {...field}
                              />
                           </FormControl>
                           <FormDescription>
                              Gunakan minimal 6 karakter. Jangan gunakan kata
                              sandi dari situs lain, atau sesuatu yang terlalu
                              mudah dipahami seperti nama hewan peliharaan Anda
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="confirm_password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Konfirmasi Password Baru</FormLabel>
                           <FormControl>
                              <Input
                                 type="password"
                                 placeholder="******"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormSuccess message={success} />
                  <FormError message={error} />

                  <Button type="submit" disabled={isPending}>
                     Submit
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
