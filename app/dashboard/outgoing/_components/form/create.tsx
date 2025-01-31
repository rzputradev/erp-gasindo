'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';

import { formatNumber } from '@/lib/utils';
import { createOutgoing } from '@/actions/outgoing/create';
import { Order, Transporter } from '@prisma/client';

import { ManualWeight } from '@/components/manual-weight';
import { AutoWeight } from '@/components/auto-weight';
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Save } from 'lucide-react';
import { createOutgoingSchema } from '@/lib/schemas/outgoing';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';

interface CreateFormProps {
   orders: Order[];
   manualInput: boolean;
}

export function CreateForm({ orders, manualInput }: CreateFormProps) {
   const router = useRouter();
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);
   const [isPending, setIspending] = useState<boolean>(false);

   const form = useForm<z.infer<typeof createOutgoingSchema>>({
      resolver: zodResolver(createOutgoingSchema),
      defaultValues: {
         weightIn: 0,
         orderId: '',
         driver: '',
         licenseNo: '',
         plateNo: '',
         transporter: Transporter.BUYER
      }
   });

   function onSubmit(values: z.infer<typeof createOutgoingSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      // console.log({ values })
      startTransition(() => {
         createOutgoing(values)
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
                  router.push('/dashboard/outgoing');
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
      <Card className="mx-auto w-full">
         <CardHeader>
            <CardTitle className="flex flex-col gap-1">
               <span className="text-left text-2xl font-bold">
                  Barang Keluar
               </span>
               <p className="font-normal text-muted-foreground">Timbang Tara</p>
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     {manualInput ? (
                        <ManualWeight
                           form={form}
                           isPending={isPending}
                           weightField="weightIn"
                        />
                     ) : (
                        <AutoWeight form={form} weightField="weightIn" />
                     )}

                     <FormField
                        control={form.control}
                        name="orderId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nomor Pengambilan</FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isPending}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih pengambilan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {orders.length > 0 ? (
                                          orders.map((order) => (
                                             <SelectItem
                                                key={order.id}
                                                value={order.id}
                                                className="flex flex-col items-start justify-start gap-2"
                                             >
                                                <span>{order.orderNo}</span>
                                                <p>
                                                   {formatNumber(
                                                      order.remainingQty
                                                   )}{' '}
                                                   Kg
                                                </p>
                                             </SelectItem>
                                          ))
                                       ) : (
                                          <div className="px-4 py-2 text-sm text-muted-foreground">
                                             Tidak ada kontrak yang tersedia
                                          </div>
                                       )}
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                              <FormDescription className="line-clamp-2">
                                 Pastikan kuantitas yang tersisa pada
                                 pengambilan mencukupi
                              </FormDescription>
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="driver"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Pengemudi</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan pengemudi"
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
                        name="licenseNo"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nomor Identitas</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan nomor identitas"
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
                        name="plateNo"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nomor Kendaraan</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan nomor kendaraan"
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
                        name="transporter"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Penyedia Angkutan</FormLabel>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                                 disabled={isPending}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih Penyedia Angkutan" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value={Transporter.BUYER}>
                                       Disediakan Pembeli
                                    </SelectItem>
                                    <SelectItem value={Transporter.SELLER}>
                                       Disediakan Penjual
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

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
