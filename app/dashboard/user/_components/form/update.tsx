'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { startTransition, useState } from 'react';
import { signOut } from 'next-auth/react';
import { Gender, Location, Role, User, UserStatus } from '@prisma/client';
import { toast } from 'sonner';

import { updateUserSchema } from '@/lib/schemas/user';
import { FileUploader } from '@/components/file-uploader';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updateUser } from '@/actions/user/update';

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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';

interface UpdateFormProps {
   data: User;
   locations: Location[];
   roles: Role[];
}

export function UpdateForm({ data, locations, roles }: UpdateFormProps) {
   const user = useCurrentUser();
   const [isPending, setIspending] = useState(false);
   const [error, setError] = useState<string | undefined>(undefined);
   const [success, setSuccess] = useState<string | undefined>(undefined);

   const form = useForm<z.infer<typeof updateUserSchema>>({
      resolver: zodResolver(updateUserSchema),
      defaultValues: {
         id: data.id,
         name: data.name || '',
         email: data.email || '',
         image: undefined,
         locationId: data.locationId || '',
         roleId: data.roleId || '',
         password: undefined,
         confirm_password: undefined,
         status: data.status || UserStatus.ACTIVE,
         gender: data.gender || undefined
      }
   });

   function onSubmit(values: z.infer<typeof updateUserSchema>) {
      setIspending(true);
      setSuccess(undefined);
      setError(undefined);
      startTransition(() => {
         updateUser(values)
            .then((res) => {
               setIspending(false);
               if (res?.error) {
                  setError(res.error);
                  toast.error(res.error);
                  form.reset();
               }
               if (res?.success) {
                  form.setValue('image', null);
                  setSuccess(res.success);
                  toast.success(res.success);
                  if (values.id === user?.id) {
                     signOut();
                  }
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
               Update Pengguna
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
                                    placeholder="Masukkan nama pengguna"
                                    disabled={isPending}
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
                                    disabled={isPending}
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
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                              <div>
                                 <FormDescription className="font-semibold">
                                    Kekuatan password:
                                 </FormDescription>
                                 <FormDescription>
                                    Gunakan minimal 6 karakter. Jangan gunakan
                                    kata sandi dari situs lain, atau sesuatu
                                    yang terlalu mudah dipahami seperti nama
                                    hewan peliharaan Anda
                                 </FormDescription>
                              </div>
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
