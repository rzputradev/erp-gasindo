'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { startTransition, useState } from 'react';
import { Gender, Location, Role, User, UserStatus } from '@prisma/client';
import { toast } from 'sonner';
import { signOut, useSession } from 'next-auth/react';

import { updatePersonalSchema } from '@/lib/schemas/setting';
import { updatePersonal } from '@/actions/setting/personal';

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
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';

interface UpdateFormProps {
   data: User & {
      location?: Location;
      role?: Role;
   };
}

export function UpdateForm({ data }: UpdateFormProps) {
   const { update } = useSession();
   const [isPending, setIspending] = useState(false);
   const [error, setError] = useState<string | undefined>(undefined);
   const [success, setSuccess] = useState<string | undefined>(undefined);

   const form = useForm<z.infer<typeof updatePersonalSchema>>({
      resolver: zodResolver(updatePersonalSchema),
      defaultValues: {
         id: data.id,
         name: data.name || '',
         image: undefined,
         gender: data.gender || undefined
      }
   });

   function onSubmit(values: z.infer<typeof updatePersonalSchema>) {
      setIspending(true);
      setSuccess(undefined);
      setError(undefined);
      startTransition(() => {
         updatePersonal(values)
            .then((res) => {
               setIspending(false);
               if (res?.error) {
                  setError(res.error);
                  toast.error(res.error);
                  form.reset();
               }
               if (res?.success) {
                  setSuccess(res.success);
                  toast.success(res.success);
                  signOut();
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
               Info Pribadi
            </CardTitle>
            <CardDescription>
               Info pribadi dan opsi untuk mengelolanya. Anda dapat mengelola
               sebagian info akun dan juga dapat melihat ringkasan profil
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
                     name="image"
                     render={({ field }) => (
                        <div className="space-y-6">
                           <FormItem className="w-full">
                              <FormLabel>Foto Profil</FormLabel>
                              <FormControl>
                                 <FileUploader
                                    value={
                                       Array.isArray(field.value)
                                          ? field.value
                                          : [field.value].filter(Boolean)
                                    }
                                    onValueChange={field.onChange}
                                    maxFiles={1}
                                    maxSize={1 * 1024 * 1024}
                                    multiple={false}
                                    disabled={isPending}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        </div>
                     )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nama</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan nama pengguna"
                                    disabled={isPending}
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormItem>
                        <FormLabel>Status Akun</FormLabel>
                        <Select defaultValue={data.status} disabled>
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue placeholder="Status akun" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              <SelectItem value={UserStatus.ACTIVE}>
                                 Aktif
                              </SelectItem>
                              <SelectItem value={UserStatus.SUSPENDED}>
                                 Ditangguhkan
                              </SelectItem>
                              <SelectItem value={UserStatus.BLOCKED}>
                                 Di Blokir
                              </SelectItem>
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>

                     <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input
                              defaultValue={data.email || ''}
                              type="email"
                              disabled
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>

                     <FormItem>
                        <FormLabel>Tempat Kerja</FormLabel>
                        <FormControl>
                           <Input
                              defaultValue={
                                 data.location?.name || 'Belum ada tempat kerja'
                              }
                              type="text"
                              disabled
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>

                     <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                           <Input
                              defaultValue={data.role?.name || 'Belum ada role'}
                              type="text"
                              disabled
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  </div>

                  <FormField
                     control={form.control}
                     name="gender"
                     render={({ field }) => (
                        <FormItem className="space-y-3">
                           <FormLabel>Jenis Kelamin</FormLabel>
                           <FormControl>
                              <RadioGroup
                                 onValueChange={field.onChange}
                                 value={field.value}
                                 className="flex space-x-4"
                                 disabled={isPending}
                              >
                                 <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                       <RadioGroupItem value={Gender.MALE} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                       Laki-laki
                                    </FormLabel>
                                 </FormItem>
                                 <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                       <RadioGroupItem value={Gender.FEMALE} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                       Perempuan
                                    </FormLabel>
                                 </FormItem>
                              </RadioGroup>
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
