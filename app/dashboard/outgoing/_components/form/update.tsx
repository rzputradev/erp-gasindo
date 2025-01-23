'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Order, OutgoingScale, Transporter } from '@prisma/client';
import { CalendarIcon, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { updateOutgoing } from '@/actions/outgoing/update';
import { updateOutgoingSchema } from '@/lib/schemas/outgoing';
import { cn } from '@/lib/utils';

import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
   Popover,
   PopoverContent,
   PopoverTrigger
} from '@/components/ui/popover';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface UpdateFormProps {
   data: OutgoingScale & {
      order?: Order;
   };
}

export function UpdateForm({ data }: UpdateFormProps) {
   const router = useRouter();
   const [isPending, setIspending] = useState<boolean>(false);
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | undefined>(undefined);

   const form = useForm<z.infer<typeof updateOutgoingSchema>>({
      resolver: zodResolver(updateOutgoingSchema),
      defaultValues: {
         id: data.id,
         ticketNo: data.ticketNo,
         driver: data.driver,
         licenseNo: data.licenseNo,
         plateNo: data.plateNo,
         entryTime: data.entryTime,
         exitTime: data.exitTime || undefined,
         weightIn: data.weightIn,
         weightOut: data.weightOut || 0,
         transporter: data.transporter || Transporter.BUYER,
         broken: data.broken || 0,
         dirty: data.dirty || 0,
         ffa: data.ffa || 0,
         fiber: data.fiber || 0,
         moist: data.moist || 0,
         sto: data.sto || 0,
         so: data.so || 0,
         seal: data.seal || '',
         note: data.note || ''
      }
   });

   function onSubmit(values: z.infer<typeof updateOutgoingSchema>) {
      setIspending(true);
      setError(undefined);
      setSuccess(undefined);
      startTransition(() => {
         updateOutgoing(values)
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
                  router.push(`/dashboard/outgoing/read?id=${data.id}`);
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
               <div className="flex flex-col gap-1">
                  <span className="text-left text-2xl font-bold">
                     Perbaharui Barang Keluar
                  </span>
                  <p className="text-sm font-normal text-muted-foreground">
                     {data.order?.orderNo}
                  </p>
               </div>
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
                        name="ticketNo"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nomor Tiket</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Masukkan nomor tiket"
                                    type="text"
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
                        name="driver"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Pengemudi</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan pengemudi"
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
                        name="licenseNo"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nomor Identitas</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan nomor identitas"
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
                        name="plateNo"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nomor Kendaraan</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    placeholder="Masukkan nomor kendaraan"
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
                        name="entryTime"
                        render={({ field }) => (
                           <FormItem className="flex flex-col">
                              <FormLabel>Waktu Masuk</FormLabel>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <FormControl>
                                       <Button
                                          variant={'outline'}
                                          className={cn(
                                             'bg-inherit pl-3 text-left font-normal',
                                             !field.value &&
                                                'text-muted-foreground'
                                          )}
                                       >
                                          {field.value ? (
                                             field.value.toLocaleString()
                                          ) : (
                                             <span>Pilih waktu</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                       </Button>
                                    </FormControl>
                                 </PopoverTrigger>
                                 <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                 >
                                    <Calendar
                                       mode="single"
                                       selected={field.value}
                                       onSelect={field.onChange}
                                       disabled={(date) =>
                                          date > new Date() ||
                                          date < new Date('1900-01-01')
                                       }
                                       initialFocus
                                    />
                                 </PopoverContent>
                              </Popover>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="exitTime"
                        render={({ field }) => (
                           <FormItem className="flex flex-col">
                              <FormLabel>Waktu Keluar</FormLabel>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <FormControl>
                                       <Button
                                          variant={'outline'}
                                          className={cn(
                                             'bg-inherit pl-3 text-left font-normal',
                                             !field.value &&
                                                'text-muted-foreground'
                                          )}
                                       >
                                          {field.value ? (
                                             field.value.toLocaleString()
                                          ) : (
                                             <span>Pilih waktu</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                       </Button>
                                    </FormControl>
                                 </PopoverTrigger>
                                 <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                 >
                                    <Calendar
                                       mode="single"
                                       selected={field.value}
                                       onSelect={field.onChange}
                                       disabled={(date) =>
                                          date > new Date() ||
                                          date < new Date('1900-01-01')
                                       }
                                       initialFocus
                                    />
                                 </PopoverContent>
                              </Popover>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="weightIn"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Neto (Kg) </FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="Masukkan neto"
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
                        name="weightOut"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Bruto (Kg) </FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="Masukkan bruto"
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
                        name="transporter"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Penyedia Angkutan</FormLabel>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                                 disabled={isPending}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Pilih Penyedia Angkutan" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value={Transporter.BUYER}>
                                       Disediakan Pembeli
                                    </SelectItem>
                                    <SelectItem value={Transporter.SELLER}>
                                       Disediakan Penjual
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

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
