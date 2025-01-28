import { zodResolver } from '@hookform/resolvers/zod';
import { Order } from '@prisma/client';
import { ArrowLeftRight, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { transferOutgoing } from '@/actions/outgoing/transfer';
import { transferOutogingSchema } from '@/lib/schemas/outgoing';
import { formatNumber } from '@/lib/utils';

import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog';
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

interface TransferProps {
   id: string;
   neto: number;
   orders: Order[];
}

export function Transfer({ id, neto, orders }: TransferProps) {
   const router = useRouter();
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);
   const [isPending, setIspending] = useState<boolean>(false);

   const form = useForm<z.infer<typeof transferOutogingSchema>>({
      resolver: zodResolver(transferOutogingSchema),
      defaultValues: {
         id: id,
         orderId: '',
         quantity: 0
      }
   });

   function onSubmit(values: z.infer<typeof transferOutogingSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         transferOutgoing(values)
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
                  router.push(`/dashboard/outgoing/read?id=${id}`);
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
      <Dialog>
         <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
            <div className="flex cursor-pointer items-center gap-2">
               <ArrowLeftRight className="size-4" />
               Pindahkan Pengambilan
            </div>
         </DialogTrigger>
         <DialogContent
            className="sm:max-w-2xl"
            onClick={(e) => e.stopPropagation()}
         >
            <DialogHeader>
               <DialogTitle>Pemindahan Pengambilan</DialogTitle>
               <DialogDescription>
                  Maksimal pemindahan pengambilan adalah {formatNumber(neto)} Kg
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
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
                              Pastikan kuantitas yang tersisa pada pengambilan
                              mencukupi
                           </FormDescription>
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="quantity"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Kuantitas Pemindahan (Kg)</FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 placeholder="Masukkan kuantitas"
                                 disabled={isPending}
                                 {...field}
                              />
                           </FormControl>
                           <FormDescription>
                              Jumlah kuantitas tambahan yang ingin Anda
                              pindahkan
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormSuccess message={success} />
                  <FormError message={error} />

                  <DialogFooter>
                     <div className="flex flex-wrap items-center space-x-2">
                        <Button
                           type="submit"
                           disabled={isPending}
                           className="flex items-center"
                        >
                           <Save />
                           Simpan
                        </Button>

                        <DialogClose asChild>
                           <Button type="button" variant="secondary">
                              Batal
                           </Button>
                        </DialogClose>
                     </div>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
