'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { exitOutgoingSchema } from '@/lib/schemas/outgoing';
import { exitOutgoing } from '@/actions/outgoing/exit';

import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { AutoWeight } from '@/components/auto-weight';
import { ManualWeight } from '@/components/manual-weight';

interface ExitFormProps {
   id: string;
   ticketNo: string;
   manualInput: boolean;
}

export function ExitForm({ id, ticketNo, manualInput }: ExitFormProps) {
   const router = useRouter();
   const [isUseSplitOrder, setIsUseSplitOrder] = useState<boolean>(false);
   const [isPending, setIspending] = useState<boolean>(false);
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);

   const form = useForm<z.infer<typeof exitOutgoingSchema>>({
      resolver: zodResolver(exitOutgoingSchema),
      defaultValues: {
         id: id,
         weightOut: 0,
         broken: 0,
         dirty: 0,
         ffa: 0,
         fiber: 0,
         moist: 0,
         sto: 0,
         so: 0,
         seal: '',
         note: '',
         splitOrderNo: ''
      }
   });

   function onSubmit(values: z.infer<typeof exitOutgoingSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         exitOutgoing(values)
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
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="flex flex-col gap-1">
               <span className="text-left text-2xl font-bold">
                  Barang Masuk
               </span>
               <p className="font-normal text-muted-foreground">{ticketNo}</p>
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     {manualInput ? (
                        <ManualWeight
                           form={form}
                           isPending={isPending}
                           weightField="weightOut"
                        />
                     ) : (
                        <AutoWeight form={form} weightField="weightOut" />
                     )}

                     <FormField
                        control={form.control}
                        name="seal"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Segel</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan segel"
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
                        name="splitOrderNo"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Pengambilan Terpisah</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan nomor pengambilan "
                                    disabled={isPending || !isUseSplitOrder}
                                    {...field}
                                 />
                              </FormControl>

                              <div className="flex items-center gap-2">
                                 <Checkbox
                                    id="updateTolerance"
                                    checked={isUseSplitOrder}
                                    onCheckedChange={(checked) =>
                                       setIsUseSplitOrder(checked === true)
                                    }
                                 />
                                 <label
                                    htmlFor="updateTolerance"
                                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                 >
                                    Gunakan nomor pengambilan terpisah
                                 </label>
                              </div>

                              {/* Conditional Description */}
                              {isUseSplitOrder && (
                                 <FormDescription>
                                    Silahkan hubungi admin untuk mendapatkan
                                    nomor pengambilan terpisah
                                 </FormDescription>
                              )}
                           </FormItem>
                        )}
                     />
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                     <AccordionItem value="item-1">
                        <AccordionTrigger>Kualitas?</AccordionTrigger>
                        <AccordionContent className="px-1">
                           <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                              <FormField
                                 control={form.control}
                                 name="broken"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Broken (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="Masukkan broken"
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
                                 name="moist"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Moist (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="Masukkan moist"
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
                                 name="so"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>SO (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="Masukkan so"
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
                                 name="sto"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>STO (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="Masukkan sto"
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
                                 name="ffa"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>FFA (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="Masukkan ffa"
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
                                 name="fiber"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Fiber (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="Masukkan fiber"
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
                                 name="dirty"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Dirty (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             type="number"
                                             placeholder="Masukkan dirty"
                                             disabled={isPending}
                                             {...field}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                           </div>
                        </AccordionContent>
                     </AccordionItem>
                  </Accordion>

                  <FormField
                     control={form.control}
                     name="note"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Catatan</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Masukkan catatan"
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
