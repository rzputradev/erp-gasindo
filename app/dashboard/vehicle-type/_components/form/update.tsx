'use client';

import * as z from 'zod';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';

import { ItemType, VehicleType } from '@prisma/client';
import { FormError } from '@/components/form-error';
import { updatePermissionSchema } from '@/lib/schemas/permission';

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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormSuccess } from '@/components/form-success';
import { updateVehicleTypeSchema } from '@/lib/schemas/vehicle-type';
import { updateVehicleType } from '@/actions/vehicle-type/update';

interface UpdateFormProps {
   data: VehicleType;
}

export function UpdateForm({ data }: UpdateFormProps) {
   const [isPending, setIspending] = useState<boolean>(false);
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);

   const form = useForm<z.infer<typeof updateVehicleTypeSchema>>({
      resolver: zodResolver(updateVehicleTypeSchema),
      defaultValues: {
         id: data.id,
         name: data.name,
         description: data.description || '',
         loadingCost: data.loadingCost || 0,
         unloadingCost: data.unloadingCost || 0
      }
   });

   function onSubmit(values: z.infer<typeof updateVehicleTypeSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         updateVehicleType(values)
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
      <Card className="mx-auto w-full rounded-md">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Perbaharui Tipe Kendaraan
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
                                    placeholder="Masukkan biaya muat"
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
                                    placeholder="masukkan biaya bongkar"
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
