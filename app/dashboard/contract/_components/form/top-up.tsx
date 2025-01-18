import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { topUp } from '@/actions/contract/top-up';
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
import { topUpContractSchema } from '@/lib/schemas/contract';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleFadingArrowUp, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { toast } from 'sonner';

interface TopUpProps {
   id: string;
}

export function TopUp({ id }: TopUpProps) {
   const router = useRouter();
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);
   const [isPending, setIspending] = useState<boolean>(false);

   const form = useForm<z.infer<typeof topUpContractSchema>>({
      resolver: zodResolver(topUpContractSchema),
      defaultValues: {
         id: id,
         topUpQty: 0
      }
   });

   function onSubmit(values: z.infer<typeof topUpContractSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         topUp(values)
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
                  router.push(`/dashboard/contract/read?id=${id}`);
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
         <DialogTrigger asChild>
            <Button variant={'outline'}>
               <CircleFadingArrowUp />
               Isi Ulang
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-xl">
            <DialogHeader>
               <DialogTitle>Isi Ulang Kontrak</DialogTitle>
               <DialogDescription>
                  Melakukan isi ulang kuantitas pada kontrak tidak akan merubah
                  berat toleransi awal
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
                  <FormField
                     control={form.control}
                     name="topUpQty"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Kuantitas (Kg)</FormLabel>
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
                              tambahkan
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
