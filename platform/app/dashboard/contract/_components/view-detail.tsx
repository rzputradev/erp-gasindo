'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Buyer, Contract, SalesStatus, Item, Location } from '@prisma/client';
import { Edit, MoreVertical, PlusCircle, Printer, Trash } from 'lucide-react';
import Link from 'next/link';

import { useCheckPermissions, useCurrentUser } from '@/hooks/use-user';
import { deleteContract } from '@/actions/contract/delete';

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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';

interface UpdateFormProps {
   data: Contract;
   locations: Location[];
   buyers: Buyer[];
   items: Item[];
}

export function ViewDetail({
   data,
   locations,
   buyers,
   items
}: UpdateFormProps) {
   const user = useCurrentUser();
   const router = useRouter();
   const createOrderAccess = useCheckPermissions(user, ['buyer:create']);

   const form = useForm();

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="flex items-start justify-between">
               <span className="text-left text-2xl font-bold">
                  Rincian Kontrak
               </span>

               <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreVertical className="size-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                     {createOrderAccess &&
                        data.status === SalesStatus.ACTIVE &&
                        data.remainingQty > 0 && (
                           <DropdownMenuItem
                              className="flex cursor-pointer items-center gap-2"
                              onClick={() =>
                                 router.push(
                                    `/dashboard/order/create?contractId=${data.id}`
                                 )
                              }
                           >
                              <PlusCircle className="size-4" /> Buat Pengambilan
                           </DropdownMenuItem>
                        )}
                     <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                        <Printer className="size-4" />
                        Surat Kontrak
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormItem>
                     <FormLabel>Nomor Kontrak</FormLabel>
                     <FormControl>
                        <Input
                           defaultValue={data.contractNo}
                           type="text"
                           disabled
                        />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Pembeli</FormLabel>
                     <FormControl>
                        <Select value={data.buyerId || undefined} disabled>
                           <SelectTrigger>
                              <SelectValue placeholder="N/A" />
                           </SelectTrigger>
                           <SelectContent>
                              {buyers.length > 0 ? (
                                 buyers.map((buyer) => (
                                    <SelectItem key={buyer.id} value={buyer.id}>
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
                  </FormItem>

                  <FormItem>
                     <FormLabel>Tempat Pengambilan</FormLabel>
                     <FormControl>
                        <Select value={data.locationId || undefined} disabled>
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
                  </FormItem>
                  <FormItem>
                     <FormLabel>Produk</FormLabel>
                     <FormControl>
                        <Select value={data.itemId || undefined} disabled>
                           <SelectTrigger>
                              <SelectValue placeholder="Pilih lokasi" />
                           </SelectTrigger>
                           <SelectContent>
                              {items.length > 0 ? (
                                 items.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
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
                  </FormItem>

                  <FormItem>
                     <FormLabel>Harga (Rp)</FormLabel>
                     <FormControl>
                        <Input
                           defaultValue={data.price}
                           type="number"
                           disabled
                        />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>PPN (%)</FormLabel>
                     <FormControl>
                        <Input
                           defaultValue={data.vat || undefined}
                           type="number"
                           disabled
                        />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Kuantitas (Kg)</FormLabel>
                     <FormControl>
                        <Input
                           defaultValue={data.quantity}
                           type="number"
                           disabled
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>

                  <FormItem>
                     <FormLabel>Isi Ulang (Kg)</FormLabel>
                     <FormControl>
                        <Input
                           defaultValue={data.topUpQty || undefined}
                           type="number"
                           disabled
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>

                  <FormItem>
                     <FormLabel>Toleransi (%)</FormLabel>
                     <FormControl>
                        <Input
                           defaultValue={data.tolerance || undefined}
                           type="number"
                           disabled
                        />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Berat Toleransi (Kg)</FormLabel>
                     <FormControl>
                        <Input
                           type="number"
                           defaultValue={data.toleranceWeigh || undefined}
                           disabled
                        />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Sisa Kuantitas (Kg)</FormLabel>
                     <FormControl>
                        <Input
                           defaultValue={data.remainingQty}
                           type="text"
                           disabled
                        />
                     </FormControl>
                  </FormItem>

                  <FormField
                     control={form.control}
                     name="status"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Status Kontrak</FormLabel>
                           <Select defaultValue={data.status} disabled>
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="N/A" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 <SelectItem value={SalesStatus.PENDING}>
                                    Ditunda
                                 </SelectItem>
                                 <SelectItem value={SalesStatus.ACTIVE}>
                                    Aktif
                                 </SelectItem>
                                 <SelectItem value={SalesStatus.COMPLETED}>
                                    Selesai
                                 </SelectItem>
                                 <SelectItem value={SalesStatus.CANCELED}>
                                    Di Batalkan
                                 </SelectItem>
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormItem className="md:col-span-2">
                     <FormLabel>Ketentuan</FormLabel>
                     <FormControl>
                        <Textarea
                           defaultValue={data.terms || undefined}
                           className="resize-none"
                           disabled
                        />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Dibuat Pada</FormLabel>
                     <FormDescription>
                        {formatDate(data.createdAt)}
                     </FormDescription>
                  </FormItem>
               </div>
            </Form>
         </CardContent>
      </Card>
   );
}
