'use client';

import { Contract, Order, SalesStatus } from '@prisma/client';
import { MoreVertical, PlusCircle, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useCheckPermissions, useCurrentUser } from '@/hooks/use-user';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
   Form,
   FormControl,
   FormDescription,
   FormItem,
   FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';
import { formatDate } from '@/lib/utils';

interface ViewDetailProps {
   data: Order & {
      contract?: Contract;
   };
}

export function ViewDetail({ data }: ViewDetailProps) {
   const user = useCurrentUser();
   const router = useRouter();
   const createOutgoingScaleAccess = useCheckPermissions(user, [
      'outgoing-scale:create'
   ]);

   const form = useForm();

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="flex items-start justify-between">
               <div className="flex flex-col gap-1">
                  <span className="text-left text-2xl font-bold">
                     Rincian Pengambilan
                  </span>
                  <p className="text-sm font-normal text-muted-foreground">
                     {data.contract?.contractNo}
                  </p>
               </div>
               <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreVertical className="size-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                     {createOutgoingScaleAccess &&
                        data.status === SalesStatus.ACTIVE && (
                           <DropdownMenuItem
                              className="flex cursor-pointer items-center gap-2"
                              onClick={() =>
                                 router.push(
                                    `/dashboard/outgoing-scale/create?contractId=${data.id}`
                                 )
                              }
                           >
                              <PlusCircle className="size-4" />{' '}
                              <p>Buat Pengambilan</p>
                           </DropdownMenuItem>
                        )}
                     <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                        <Printer className="size-4" /> <p>Surat Pengambilan</p>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormItem>
                     <FormLabel>Nomor Pengambilan</FormLabel>
                     <FormControl>
                        <Input
                           defaultValue={data.orderNo}
                           type="text"
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
                  </FormItem>

                  <FormItem>
                     <FormLabel>Sisa Kuantitas (Kg)</FormLabel>
                     <FormControl>
                        <Input
                           defaultValue={data.remainingQty}
                           type="number"
                           disabled
                        />
                     </FormControl>
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
                  </FormItem>

                  <FormItem>
                     <FormLabel>Status Pengambilan</FormLabel>
                     <Select defaultValue={data.status} disabled>
                        <FormControl>
                           <SelectTrigger>
                              <SelectValue placeholder="N/A" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value={SalesStatus.PENDING}>
                              Dibuat
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
                  </FormItem>

                  <FormItem className="md:col-span-2">
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
