'use client';

import {
   Contract,
   Location,
   Order,
   OutgoingScale,
   Transporter
} from '@prisma/client';
import { MoreVertical, TicketSlash } from 'lucide-react';
import { useForm } from 'react-hook-form';

import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger
} from '@/components/ui/accordion';
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
import { Textarea } from '@/components/ui/textarea';
import { useCheckPermissions, useCurrentUser } from '@/hooks/use-user';
import { formatDate, formatNumber } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Ticket } from './ticket';
import { Transfer } from './form/transfer';

interface ViewDetailProps {
   data: OutgoingScale & {
      order?: Order & {
         contract?: Contract & {
            location?: Location;
         };
      };
      splitOrder?: OutgoingScale & {
         order?: Order;
      };
   };
   orders: Order[];
}

export function ViewDetail({ data, orders }: ViewDetailProps) {
   const user = useCurrentUser();
   const router = useRouter();
   const createAccess = useCheckPermissions(user, ['outgoing:create']);
   const updateAccess = useCheckPermissions(user, ['outgoing:update']);
   const isExit = !!data?.exitTime;
   const form = useForm();

   return (
      <Card className="mx-auto w-full rounded-lg bg-sidebar/20">
         <CardHeader>
            <CardTitle className="flex items-start justify-between">
               <div className="flex flex-col gap-1">
                  <span className="text-left text-2xl font-bold">
                     Rincian Barang Keluar
                  </span>
                  <p className="text-sm font-normal text-muted-foreground">
                     {data.order?.orderNo}
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
                     {createAccess && !isExit && (
                        <DropdownMenuItem
                           className="flex cursor-pointer items-center gap-2"
                           onClick={() =>
                              router.push(
                                 `/dashboard/outgoing/exit?id=${data.id}`
                              )
                           }
                        >
                           <TicketSlash className="size-4" /> Timbang Keluar
                        </DropdownMenuItem>
                     )}
                     {isExit && (
                        <>
                           <DropdownMenuItem>
                              <Ticket data={data} />
                           </DropdownMenuItem>
                           {updateAccess && (
                              <DropdownMenuItem>
                                 <Transfer
                                    id={data.id}
                                    neto={data.weightOut! - data.weightIn}
                                    orders={orders}
                                 />
                              </DropdownMenuItem>
                           )}
                        </>
                     )}
                  </DropdownMenuContent>
               </DropdownMenu>
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     <FormItem>
                        <FormLabel>Nomor Tiket</FormLabel>
                        <FormControl>
                           <Input
                              defaultValue={data.ticketNo}
                              type="text"
                              disabled
                           />
                        </FormControl>
                     </FormItem>

                     {data.splitId && (
                        <FormItem>
                           <FormLabel>Nomor Tiket Sambungan</FormLabel>
                           <FormControl>
                              <Input
                                 defaultValue={data.splitOrder?.ticketNo}
                                 type="text"
                                 disabled
                              />
                           </FormControl>
                        </FormItem>
                     )}

                     <FormItem>
                        <FormLabel>Pengemudi</FormLabel>
                        <FormControl>
                           <Input
                              defaultValue={data.driver}
                              type="text"
                              disabled
                           />
                        </FormControl>
                     </FormItem>

                     <FormItem>
                        <FormLabel>Nomor Identitas</FormLabel>
                        <FormControl>
                           <Input
                              defaultValue={data.licenseNo}
                              type="text"
                              disabled
                           />
                        </FormControl>
                     </FormItem>

                     <FormItem>
                        <FormLabel>Nomor Kendaraan</FormLabel>
                        <FormControl>
                           <Input
                              defaultValue={data.plateNo}
                              type="text"
                              disabled
                           />
                        </FormControl>
                     </FormItem>

                     <FormItem>
                        <FormLabel>Waktu Masuk</FormLabel>
                        <FormControl className="flex justify-between">
                           <Input
                              defaultValue={formatDate(data.entryTime)}
                              type="text"
                              disabled
                           />
                        </FormControl>
                     </FormItem>

                     {data.exitTime && (
                        <FormItem>
                           <FormLabel>Waktu Keluar</FormLabel>
                           <FormControl className="flex justify-between">
                              <Input
                                 defaultValue={formatDate(data.exitTime)}
                                 type="text"
                                 disabled
                              />
                           </FormControl>
                        </FormItem>
                     )}

                     <FormItem>
                        <FormLabel>Tara (Kg) </FormLabel>
                        <FormControl>
                           <Input
                              defaultValue={data.weightIn}
                              type="number"
                              disabled
                           />
                        </FormControl>
                     </FormItem>

                     {data.exitTime && (
                        <FormItem>
                           <FormLabel>Bruto (Kg) </FormLabel>
                           <FormControl>
                              <Input
                                 defaultValue={data.weightOut || undefined}
                                 type="number"
                                 disabled
                              />
                           </FormControl>
                        </FormItem>
                     )}

                     {data.exitTime && (
                        <FormItem>
                           <FormLabel>Neto (Kg) </FormLabel>
                           <FormControl>
                              <Input
                                 defaultValue={
                                    (data.weightOut || 0) - data.weightIn
                                 }
                                 type="number"
                                 disabled
                              />
                           </FormControl>
                        </FormItem>
                     )}

                     <FormItem>
                        <FormLabel>Penyedia Angkutan</FormLabel>
                        <Select defaultValue={data.transporter} disabled>
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue placeholder="N/A" />
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
                     </FormItem>

                     {data.exitTime && (
                        <FormItem>
                           <FormLabel>Segel</FormLabel>
                           <FormControl>
                              <Input
                                 defaultValue={data.seal || undefined}
                                 type="text"
                                 disabled
                              />
                           </FormControl>
                        </FormItem>
                     )}
                  </div>

                  {data.exitTime && (
                     <>
                        <Accordion type="single" collapsible className="w-full">
                           <AccordionItem value="item-1">
                              <AccordionTrigger>Kualitas?</AccordionTrigger>
                              <AccordionContent className="px-1">
                                 <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <FormItem>
                                       <FormLabel>Broken (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             defaultValue={
                                                data.broken || undefined
                                             }
                                             type="number"
                                             disabled
                                          />
                                       </FormControl>
                                    </FormItem>

                                    <FormItem>
                                       <FormLabel>Moist (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             defaultValue={
                                                data.moist || undefined
                                             }
                                             type="number"
                                             disabled
                                          />
                                       </FormControl>
                                    </FormItem>

                                    <FormItem>
                                       <FormLabel>SO (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             defaultValue={data.so || undefined}
                                             type="number"
                                             disabled
                                          />
                                       </FormControl>
                                    </FormItem>

                                    <FormItem>
                                       <FormLabel>STO (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             defaultValue={
                                                data.sto || undefined
                                             }
                                             type="number"
                                             disabled
                                          />
                                       </FormControl>
                                    </FormItem>

                                    <FormItem>
                                       <FormLabel>FFA (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             defaultValue={
                                                data.ffa || undefined
                                             }
                                             type="number"
                                             disabled
                                          />
                                       </FormControl>
                                    </FormItem>

                                    <FormItem>
                                       <FormLabel>Fiber (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             defaultValue={
                                                data.fiber || undefined
                                             }
                                             type="number"
                                             disabled
                                          />
                                       </FormControl>
                                    </FormItem>

                                    <FormItem>
                                       <FormLabel>Dirty (%)</FormLabel>
                                       <FormControl>
                                          <Input
                                             defaultValue={
                                                data.dirty || undefined
                                             }
                                             type="number"
                                             disabled
                                          />
                                       </FormControl>
                                    </FormItem>
                                 </div>
                              </AccordionContent>
                           </AccordionItem>
                        </Accordion>

                        <FormItem>
                           <FormLabel>Catatan</FormLabel>
                           <FormControl>
                              <Textarea
                                 defaultValue={data.note || undefined}
                                 className="resize-none"
                                 disabled
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     </>
                  )}
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
