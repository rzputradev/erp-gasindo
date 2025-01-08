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
import { Location } from '@prisma/client';
import { createTransporterSchema } from '@/lib/schemas/transporter';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';
import { createTransporter } from '@/actions/transporter/create';

interface CreateFormProps {
   locations: Location[];
}

export function CreateForm({ locations }: CreateFormProps) {
   const router = useRouter();
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);
   const [isPending, setIspending] = useState<boolean>(false);

   const form = useForm<z.infer<typeof createTransporterSchema>>({
      resolver: zodResolver(createTransporterSchema),
      defaultValues: {
         name: '',
         locationId: undefined,
         key: '',
         phone: '',
         address: ''
      }
   });

   function onSubmit(values: z.infer<typeof createTransporterSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         createTransporter(values)
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
                  router.push('/dashboard/transporter');
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
               Tambah Pengangkutan
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
                                    type="text"
                                    placeholder="Masukkan nama "
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

                     <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>No Handphone</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    disabled={isPending}
                                    placeholder="Masukkan no handphone"
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
                              <FormLabel>Lokasi</FormLabel>
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
                  </div>

                  <FormField
                     control={form.control}
                     name="address"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Alamat</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Tulis alamat lengkap"
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
