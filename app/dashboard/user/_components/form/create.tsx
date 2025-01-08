'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gender, Location, Role, UserStatus } from '@prisma/client';

import { createUserSchema } from '@/lib/schemas/user';

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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileUploader } from '@/components/file-uploader';
import { createUser } from '@/actions/user/create';
import { toast } from 'sonner';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';

interface CreateFormProps {
   roles: Role[];
   locations: Location[];
}

export function CreateForm({ locations, roles }: CreateFormProps) {
   const router = useRouter();
   const [isPending, setIspending] = useState(false);
   const [error, setError] = useState<string | undefined>(undefined);
   const [success, setSuccess] = useState<string | undefined>(undefined);

   const form = useForm<z.infer<typeof createUserSchema>>({
      resolver: zodResolver(createUserSchema),
      defaultValues: {
         name: '',
         email: '',
         image: undefined,
         locationId: '',
         roleId: '',
         password: '',
         confirm_password: '',
         status: undefined,
         gender: undefined
      }
   });

   function onSubmit(values: z.infer<typeof createUserSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      console.log(values);
      startTransition(() => {
         createUser(values)
            .then((res) => {
               setIspending(false);
               form.reset();
               if (res?.error) {
                  setError(res.error);
                  toast.error(res.error);
               }
               if (res?.success) {
                  toast.success(res.success);
                  router.push('/dashboard/user');
               }
            })
            .catch((e) => {
               console.log(e);
               toast.error('Something went wrong!');
            });
      });
   }

   return (
      <Card className="mx-auto w-full rounded-md">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Tambah Pengguna
            </CardTitle>
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
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    maxFiles={1}
                                    maxSize={1 * 1024 * 1024}
                                    multiple={false}
                                    disabled={isPending}
                                    // progresses={progresses}
                                    // pass the onUpload function here for direct upload
                                    // onUpload={uploadFiles}
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
                                    placeholder="Masukkan nama pengguna"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="locationId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Tempat Kerja</FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isPending}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih lokasi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {locations.length > 0 ? (
                                          locations.map((location) => (
                                             <SelectItem
                                                key={location.id}
                                                value={location.id}
                                             >
                                                {location.name}
                                             </SelectItem>
                                          ))
                                       ) : (
                                          <div className="px-4 py-2 text-sm text-gray-500">
                                             Tidak ada lokasi yang tersedia
                                          </div>
                                       )}
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                 <Input
                                    type="email"
                                    placeholder="Masukkan alamat email"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="roleId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isPending}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {roles.length > 0 ? (
                                          roles.map((role) => (
                                             <SelectItem
                                                key={role.id}
                                                value={role.id}
                                             >
                                                {role.name}
                                             </SelectItem>
                                          ))
                                       ) : (
                                          <div className="px-4 py-2 text-sm text-gray-500">
                                             Tidak ada role yang tersedia
                                          </div>
                                       )}
                                    </SelectContent>
                                 </Select>
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
                        name="status"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                                 disabled={isPending}
                              >
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
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="confirm_password"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Konfirmasi Password</FormLabel>
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

                  <Button type="submit">Submit</Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
