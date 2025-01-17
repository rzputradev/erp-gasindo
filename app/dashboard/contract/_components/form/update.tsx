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
   ContractStatus,
   Item,
   Location
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

interface UpdateFormProps {
   data: Contract;
   locations: Location[];
   buyers: Buyer[];
   items: Item[];
}

export function UpdateForm({
   data,
   locations,
   buyers,
   items
}: UpdateFormProps) {
   const router = useRouter();
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);
   const [isPending, setIspending] = useState<boolean>(false);
   const [isUpdateTolerance, setIsUpdateTolerance] = useState<boolean>(false);
   const topUpAccess = useCheckPermissions(
      ['contract:create', 'contract:update'],
      'AND'
   );

   const form = useForm<z.infer<typeof updateContracSchema>>({
      resolver: zodResolver(updateContracSchema),
      defaultValues: {
         id: data.id,
         contractNo: data.contractNo || '',
         buyerId: data.buyerId || '',
         itemId: data.itemId || '',
         locationId: data.locationId || '',
         price: data.price,
         vat: data.vat || 0,
         tolerance: data.tolerance || 0,
         quantity: data.quantity || 0,
         remainingQty: data.remainingQty || 0,
         toleranceWeigh: data.toleranceWeigh || 0,
         topUpQty: data.topUpQty || 0,
         status: data.status || ContractStatus.CREATED,
         terms: data.terms || '',
         updateTolerance: false
      }
   });

   function onSubmit(values: z.infer<typeof updateContracSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         updateContract(values)
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
                  router.push(`/dashboard/contract/read?id=${data.id}`);
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
            <CardTitle className="flex items-start justify-between">
               <span className="text-left text-2xl font-bold">
                  Perbaharui Kontrak
               </span>
               {topUpAccess && data.status === ContractStatus.ACTIVE && (
                  <TopUp id={data.id} />
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
                        name="contractNo"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>No Kontrak</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan nomor kontrak"
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
                        name="buyerId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Pembeli</FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isPending}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih Pembeli" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {buyers.length > 0 ? (
                                          buyers.map((buyer) => (
                                             <SelectItem
                                                key={buyer.id}
                                                value={buyer.id}
                                             >
                                                {buyer.name}
                                             </SelectItem>
                                          ))
                                       ) : (
                                          <div className="px-4 py-2 text-sm text-gray-500">
                                             Tidak ada pembeli yang tersedia
                                          </div>
                                       )}
                                    </SelectContent>
                                 </Select>
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
                              <FormLabel>Tempat Pengambilan</FormLabel>
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

                     <FormField
                        control={form.control}
                        name="itemId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Produk</FormLabel>
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
                                       {items.length > 0 ? (
                                          items.map((item) => (
                                             <SelectItem
                                                key={item.id}
                                                value={item.id}
                                             >
                                                {item.name}
                                             </SelectItem>
                                          ))
                                       ) : (
                                          <div className="px-4 py-2 text-sm text-gray-500">
                                             Tidak ada produk yang tersedia
                                          </div>
                                       )}
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Harga (Rp)</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="Masukkan harga"
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
                        name="vat"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>PPN (%)</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="Masukkan PPN"
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
                        name="tolerance"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Toleransi (%)</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="Masukkan toleransi kuantitas"
                                    disabled={isPending || !isUpdateTolerance}
                                    {...field}
                                 />
                              </FormControl>
                              <div className="flex items-center gap-2">
                                 <Checkbox
                                    id="updateTolerance"
                                    checked={isUpdateTolerance}
                                    onCheckedChange={(checked) => {
                                       const newCheckedState = checked === true;
                                       form.setValue(
                                          'updateTolerance',
                                          newCheckedState
                                       );
                                       setIsUpdateTolerance(newCheckedState);
                                    }}
                                 />
                                 <label
                                    htmlFor="updateTolerance"
                                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                 >
                                    Perbaharui persentase toleransi
                                 </label>
                              </div>
                              {isUpdateTolerance && (
                                 <FormDescription>
                                    Mengubah nilai toleransi akan secara
                                    otomatis memperbarui nilai berat toleransi
                                    dan sisa kuantitas terkait
                                 </FormDescription>
                              )}
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="toleranceWeigh"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Berat Toleransi (Kg)</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="Masukkan kuantitas berat toleransi"
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
                              <FormLabel>Sisa kuantitas (Kg)</FormLabel>
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
                        name="status"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Status Kontrak</FormLabel>
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
                                    <SelectItem value={ContractStatus.CREATED}>
                                       Dibuat
                                    </SelectItem>
                                    <SelectItem value={ContractStatus.ACTIVE}>
                                       Aktif
                                    </SelectItem>
                                    <SelectItem value={ContractStatus.CANCELED}>
                                       Di Batalkan
                                    </SelectItem>
                                    <SelectItem value={ContractStatus.CLOSED}>
                                       Selesai
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <FormField
                     control={form.control}
                     name="terms"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Ketentuan</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Masukkan ketentuan kontrak"
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
