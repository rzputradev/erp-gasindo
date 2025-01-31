'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { createSupplier } from '@/actions/supplier/create';
import { createSupplierSchema } from '@/lib/schemas/supplier';

import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

export function CreateForm() {
   const router = useRouter();
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);
   const [isPending, setIspending] = useState<boolean>(false);

   const form = useForm<z.infer<typeof createSupplierSchema>>({
      resolver: zodResolver(createSupplierSchema),
      defaultValues: {
         name: '',
         key: '',
         phone: '',
         address: ''
      }
   });

   function onSubmit(values: z.infer<typeof createSupplierSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         createSupplier(values)
            .then((res) => {
               setIspending(false);
               form.reset();
               if (res?.error) {
                  setError(res.error);
                  toast.error(res.error);
               }
               if (res?.success) {
                  setSuccess(res.success);
                  toast.success(res.success);
                  router.push('/dashboard/supplier');
               }
            })
            .catch((e) => {
               console.log(e);
               form.reset();
               setIspending(false);
               toast.error('Terjadi kesalahan tak terduga');
            });
      });
   }

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Tambah Pemasok
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
                                    placeholder="Masukkan nama pembeli"
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
                              <FormLabel>Kode</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan kode"
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
                        name="phone"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>No Handphone</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan nomor handphone"
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
                     name="address"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Alamat</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Masukkan alamat lengkap"
                                 className="resize-none"
                                 disabled={isPending}
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormSuccess message={success} />
                  <FormError message={error} />

                  <Button
                     type="submit"
                     disabled={isPending}
                     size={'sm'}
                     className="flex items-center"
                  >
                     <Save />
                     Simpan
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
