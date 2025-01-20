'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
   Buyer,
   Contract,
   Item,
   Location,
   Order,
   SalesStatus
} from '@prisma/client';
import { CircleFadingArrowUp, Save, Undo2 } from 'lucide-react';
import Link from 'next/link';

import { updateContract } from '@/actions/contract/update';
import { updateContracSchema } from '@/lib/schemas/contract';
import { useCheckPermissions } from '@/hooks/use-user';

import { TopUp } from './top-up';
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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { updateOrderSchema } from '@/lib/schemas/order';
import { formatNumber } from '@/lib/utils';
import { updateOrder } from '@/actions/order/update';

interface UpdateFormProps {
   data: Order & {
      contract?: Contract;
   };
}

export function UpdateForm({ data }: UpdateFormProps) {
   const router = useRouter();
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);
   const [isPending, setIspending] = useState<boolean>(false);
   const topUpAccess = useCheckPermissions(
      ['order:create', 'order:update'],
      'AND'
   );
   const remainingContractQty = data.contract?.remainingQty || 0;

   const form = useForm<z.infer<typeof updateOrderSchema>>({
      resolver: zodResolver(updateOrderSchema),
      defaultValues: {
         id: data.id,
         orderNo: data.orderNo,
         quantity: data.quantity,
         remainingQty: data.remainingQty,
         status: data.status,
         topUpQty: data.topUpQty || 0
      }
   });

   function onSubmit(values: z.infer<typeof updateOrderSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         updateOrder(values)
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
                  router.push(`/dashboard/order/read?id=${data.id}`);
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
            <CardTitle className="flex items-start justify-between">
               <div className="flex flex-col gap-1">
                  <span className="text-left text-2xl font-bold">
                     Perbaharui Pengambilan
                  </span>
                  <p className="text-sm font-normal text-muted-foreground">
                     {data.contract?.contractNo}
                  </p>
               </div>
               {topUpAccess &&
                  remainingContractQty > 0 &&
                  data.status === SalesStatus.ACTIVE &&
                  data.contract?.status === SalesStatus.ACTIVE && (
                     <TopUp
                        id={data.id}
                        remainingContractQty={remainingContractQty}
                     />
                  )}
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
                        name="orderNo"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nomor Pengambilan</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan nomor pengambilan"
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
                        name="quantity"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Kuantitas (Kg)</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="Masukkan kuantitas"
                                    disabled
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="remainingQty"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Sisa Kuantitas (Kg)</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="Masukkan sisa kuantitas"
                                    disabled
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="topUpQty"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Isi Ulang (Kg)</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="Masukkan isi ulang"
                                    disabled
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
                              <FormLabel>Status Pengambilan</FormLabel>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                                 disabled={isPending}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value={SalesStatus.PENDING}>
                                       Ditunda
                                    </SelectItem>
                                    <SelectItem value={SalesStatus.ACTIVE}>
                                       Dalam Proses
                                    </SelectItem>
                                    <SelectItem value={SalesStatus.COMPLETED}>
                                       Selesai
                                    </SelectItem>
                                    <SelectItem value={SalesStatus.CANCELED}>
                                       Dibatalkan
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
                     <Save /> Simpan
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
