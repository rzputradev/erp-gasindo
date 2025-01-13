'use client';

import { Buyer } from '@prisma/client';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ViewDetailProps {
   data: Buyer;
}

export function ViewDetail({ data }: ViewDetailProps) {
   const form = useForm();

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Rincian Pembeli
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

                  <FormItem className="col-span-2">
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
                     <FormControl>
                        <Input
                           type="text"
                           defaultValue={
                              data.createdAt
                                 ? new Date(data.createdAt).toLocaleDateString()
                                 : 'N/A'
                           }
                           disabled
                        />
                     </FormControl>
                  </FormItem>

                  <FormItem>
                     <FormLabel>Terakhir di Perbaharui</FormLabel>
                     <FormControl>
                        <Input
                           type="text"
                           defaultValue={
                              data.updatedAt
                                 ? new Date(data.updatedAt).toLocaleDateString()
                                 : 'N/A'
                           }
                           disabled
                        />
                     </FormControl>
                  </FormItem>
               </div>
            </Form>
         </CardContent>
      </Card>
   );
}
