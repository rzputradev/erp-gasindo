'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { startTransition, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';
import { Contract } from '@prisma/client';
import { Save } from 'lucide-react';
import { createOrderSchema } from '@/lib/schemas/order';
import { formatNumber } from '@/lib/utils';
import { createOrder } from '@/actions/order/create';
import { toast } from 'sonner';

interface CreateFromProps {
   contracts: Contract[];
}

export function CreateForm({ contracts }: CreateFromProps) {
   const router = useRouter();
   const params = useSearchParams();
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);
   const [isPending, setIspending] = useState<boolean>(false);

   const contractId = params.get('contractId');

   const form = useForm<z.infer<typeof createOrderSchema>>({
      resolver: zodResolver(createOrderSchema),
      defaultValues: {
         contractId: contractId || '',
         quantity: 0
      }
   });

   function onSubmit(values: z.infer<typeof createOrderSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         createOrder(values)
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
                  router.push('/dashboard/order');
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
               Tambah Pengambilan
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
                        name="contractId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nomor Kontrak</FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isPending}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih kontrak" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {contracts.length > 0 ? (
                                          contracts.map((contract) => (
                                             <SelectItem
                                                key={contract.id}
                                                value={contract.id}
                                                className="flex flex-col items-start justify-start gap-2"
                                             >
                                                <span>
                                                   {contract.contractNo}
                                                </span>
                                                <p>
                                                   {formatNumber(
                                                      contract.remainingQty
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
                              <FormDescription className="line-clamp-2">
                                 Pilih nomor kontrak untuk pengambilan produk.
                                 Pastikan kuantitas yang tersisa pada kontrak
                                 mencukupi
                              </FormDescription>
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
                                    placeholder="Masukkan harga satuan"
                                    disabled={isPending}
                                    {...field}
                                 />
                              </FormControl>
                              <FormDescription>
                                 Masukkan jumlah kuantitas produk yang akan
                                 dilakukan pengambilan.
                              </FormDescription>
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
                     className="contracts-center flex"
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
