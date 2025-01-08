'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';

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
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { createVehicleTypeSchema } from '@/lib/schemas/vehicle-type';
import { createVehicleType } from '@/actions/vehicle-type/create';

export function CreateForm() {
   const router = useRouter();
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);
   const [isPending, setIspending] = useState<boolean>(false);

   const form = useForm<z.infer<typeof createVehicleTypeSchema>>({
      resolver: zodResolver(createVehicleTypeSchema),
      defaultValues: {
         name: '',
         description: '',
         loadingCost: 0,
         unloadingCost: 0
      }
   });

   function onSubmit(values: z.infer<typeof createVehicleTypeSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         createVehicleType(values)
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
                  router.push('/dashboard/vehicle-type');
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
               Tambah Tipe Kendaraan
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
                                    placeholder="Masukkan nama izin"
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
                        name="loadingCost"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Biaya Muat</FormLabel>
                              <FormControl>
                                 <Input
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
                        name="unloadingCost"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Biaya Bongkar</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
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
                                 placeholder="Tulis deskipsi"
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

                  <Button type="submit" disabled={isPending}>
                     Submit
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
