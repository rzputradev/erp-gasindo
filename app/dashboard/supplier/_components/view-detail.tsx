'use client';

import { useForm } from 'react-hook-form';
import { Supplier } from '@prisma/client';

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
import { formatDate } from '@/lib/utils';

interface ViewDetailProps {
   data: Supplier;
}

export function ViewDetail({ data }: ViewDetailProps) {
   const form = useForm();

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
               Rincian Pemasok
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     <FormItem>
                        <FormLabel>Nama</FormLabel>
                        <FormControl>
                           <Input
                              defaultValue={data.name}
                              type="text"
                              disabled
                           />
                        </FormControl>
                     </FormItem>

                     <FormItem>
                        <FormLabel>Key</FormLabel>
                        <FormControl>
                           <Input
                              defaultValue={data.key}
                              type="text"
                              disabled
                           />
                        </FormControl>
                     </FormItem>

                     <FormItem>
                        <FormLabel>No Handphone</FormLabel>
                        <FormControl>
                           <Input
                              defaultValue={data.phone}
                              type="text"
                              disabled
                           />
                        </FormControl>
                     </FormItem>

                     <FormItem className="col-span-2">
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                           <Textarea
                              defaultValue={data.address || undefined}
                              className="resize-none"
                              disabled
                           />
                        </FormControl>
                     </FormItem>
                  </div>

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
