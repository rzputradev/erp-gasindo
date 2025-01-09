'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Permission } from '@prisma/client';
import { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';

import { createRoleSchema } from '@/lib/schemas/role';
import { createRole } from '@/actions/role/create';

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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';

interface CreateFormProps {
   permissions: Permission[];
}

export function CreateForm({ permissions }: CreateFormProps) {
   const router = useRouter();
   const [isPending, setIspending] = useState(false);
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);

   const form = useForm<z.infer<typeof createRoleSchema>>({
      resolver: zodResolver(createRoleSchema),
      defaultValues: {
         name: '',
         key: '',
         description: '',
         permissions: []
      }
   });

   function onSubmit(values: z.infer<typeof createRoleSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         createRole(values)
            .then((res) => {
               setIspending(false);
               form.reset();
               if (res?.error) {
                  setError(res.error);
                  toast.error(res.error);
               }
               if (res?.success) {
                  toast.success(res.success);
                  router.push('/dashboard/role');
               }
            })
            .catch((e) => {
               console.log(e);
               toast.error('Something went wrong!');
            });
      });
   }

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Tambah Role
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nama</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Masukkan nama role"
                                    type="text"
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
                        name="key"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Key</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan key"
                                    disabled={isPending}
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
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Deskripsi</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Masukkan deskripsi role"
                                 className="resize-none"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="permissions"
                     render={() => (
                        <FormItem>
                           <div className="mb-4">
                              <FormLabel className="text-lg font-semibold">
                                 Pemberian Izin
                              </FormLabel>
                              <FormDescription>
                                 Pilih izin yang akan diberikan pada role ini
                              </FormDescription>
                           </div>
                           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              {permissions.map((permission) => (
                                 <FormField
                                    key={permission.id}
                                    control={form.control}
                                    name="permissions"
                                    render={({ field }) => {
                                       return (
                                          <FormItem
                                             key={permission.id}
                                             className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"
                                          >
                                             <div className="space-y-0.5">
                                                <FormLabel>
                                                   {permission.name}
                                                </FormLabel>
                                                <FormDescription className="truncate">
                                                   {permission.description}
                                                </FormDescription>
                                             </div>
                                             <FormControl>
                                                <Switch
                                                   disabled={isPending}
                                                   checked={
                                                      field.value?.includes(
                                                         permission.id
                                                      ) || false
                                                   }
                                                   onCheckedChange={(
                                                      checked
                                                   ) => {
                                                      const currentValue =
                                                         field.value || []; // Default to an empty array if undefined
                                                      field.onChange(
                                                         checked
                                                            ? [
                                                                 ...currentValue,
                                                                 permission.id
                                                              ] // Add the permission
                                                            : currentValue.filter(
                                                                 (value) =>
                                                                    value !==
                                                                    permission.id
                                                              ) // Remove the permission
                                                      );
                                                   }}
                                                />
                                             </FormControl>
                                          </FormItem>
                                       );
                                    }}
                                 />
                              ))}
                           </div>
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
