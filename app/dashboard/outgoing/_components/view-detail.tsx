'use client';

import { Buyer } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useCheckPermissions } from '@/hooks/use-user';
import { MoreVertical, PlusCircle } from 'lucide-react';
import Link from 'next/link';

import {
   Form,
   FormControl,
   FormDescription,
   FormItem,
   FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

interface ViewDetailProps {
   data: Buyer;
}

export function ViewDetail({ data }: ViewDetailProps) {
   const router = useRouter();
   const createContractAccess = useCheckPermissions(['contract:create']);

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
                        <MoreVertical className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                     {createContractAccess && (
                        <DropdownMenuItem
                           className="flex cursor-pointer items-center gap-2"
                           onClick={() =>
                              router.push(
                                 `/dashboard/contract/create?buyerId=${data.id}`
                              )
                           }
                        >
                           <PlusCircle className="size-4" /> <p>Buat Kontrak</p>
                        </DropdownMenuItem>
                     )}
                  </DropdownMenuContent>
               </DropdownMenu>
            </CardTitle>
         </CardHeader>

         <CardContent>
            <Form {...form}>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormItem>
                     <FormLabel>Nama</FormLabel>
                     <FormControl>
                        <Input type="text" defaultValue={data.name} disabled />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Key</FormLabel>
                     <FormControl>
                        <Input type="text" defaultValue={data.key} disabled />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Surat Wajib Pajak</FormLabel>
                     <FormControl>
                        <Input type="text" defaultValue={data.tin} disabled />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>No Handphone</FormLabel>
                     <FormControl>
                        <Input type="text" defaultValue={data.phone} disabled />
                     </FormControl>
                  </FormItem>

                  <FormItem className="md:col-span-2">
                     <FormLabel>Alamat</FormLabel>
                     <FormControl>
                        <Textarea
                           className="resize-none"
                           defaultValue={data.address}
                           disabled
                        />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Dibuat Pada</FormLabel>
                     <FormDescription>
                        {data.createdAt
                           ? new Date(data.createdAt).toLocaleString()
                           : 'N/A'}
                     </FormDescription>
                  </FormItem>
               </div>
            </Form>
         </CardContent>
      </Card>
   );
}
