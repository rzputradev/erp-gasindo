'use client';

import { useCurrentUser } from '@/hooks/use-user';
import { formatDate, formatNumber } from '@/lib/utils';
import {
   Contract,
   Location,
   Order,
   OutgoingScale,
   Transporter
} from '@prisma/client';
import {
   Page,
   Text,
   View,
   Document,
   StyleSheet,
   BlobProvider,
   Image
} from '@react-pdf/renderer';
import { Printer } from 'lucide-react';
import { User } from 'next-auth';
import { toast } from 'sonner';

interface TicketProps {
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
}

interface TicketDocumentProps {
   tickets: TicketProps['data'][];
   user: User;
   millName: string;
   companyName: string;
   companyTagline: string;
   companyLogo: string;
}

function TicketDocument({
   tickets,
   user,
   companyLogo,
   companyName,
   companyTagline,
   millName
}: TicketDocumentProps) {
   return (
      <Document>
         {tickets.map((data, index) => {
            return (
               <Page
                  key={index}
                  size={['21cm', '14cm']}
                  style={{
                     paddingVertical: '0.8cm',
                     paddingHorizontal: '1cm',
                     fontFamily: 'Times-Roman',
                     fontSize: 12,
                     flexDirection: 'column',
                     justifyContent: 'space-between'
                  }}
               >
                  {/* Header */}
                  <View>
                     <View
                        style={{
                           flexDirection: 'row',
                           justifyContent: 'space-between',
                           alignItems: 'center'
                        }}
                     >
                        <View
                           style={{
                              flexDirection: 'row',
                              alignItems: 'flex-start'
                           }}
                        >
                           <Image
                              src={companyLogo}
                              style={{ height: '1.1cm', width: '1.5cm' }}
                           />
                           <View style={{ marginLeft: '0.3cm' }}>
                              <Text
                                 style={{
                                    fontFamily: 'Times-Bold',
                                    fontSize: 15
                                 }}
                              >
                                 {companyName.toUpperCase()}
                              </Text>
                              <Text
                                 style={{ letterSpacing: 0.5, fontSize: 11.5 }}
                              >
                                 {companyTagline.toUpperCase()}
                              </Text>
                           </View>
                        </View>
                        <View style={{ fontSize: 11, alignItems: 'flex-end' }}>
                           <Text style={{ fontFamily: 'Times-Bold' }}>
                              {millName.toUpperCase()}
                           </Text>
                           <Text style={{ letterSpacing: 0.8 }}>
                              TIKET TIMBANGAN
                           </Text>
                        </View>
                     </View>

                     {/* Separator */}
                     <View
                        style={{
                           borderBottom: '1px solid black',
                           marginTop: '8px',
                           marginBottom: '1px'
                        }}
                     />
                     <View
                        style={{
                           borderBottom: '2px solid black',
                           marginBottom: '12px'
                        }}
                     />
                  </View>

                  {/* Content */}
                  <View style={{ fontFamily: 'Times-Roman', fontSize: 12 }}>
                     <View
                        style={{
                           flexDirection: 'row',
                           justifyContent: 'space-between'
                        }}
                     >
                        {/* Left Column */}
                        <View style={{ flex: 1 }}>
                           <View
                              style={{
                                 flexDirection: 'row',
                                 justifyContent: 'space-between',
                                 marginBottom: 6
                              }}
                           >
                              <Text style={{ flex: 0.8 }}>Tiket</Text>
                              <Text style={{ flex: 1 }}>: {data.ticketNo}</Text>
                           </View>
                           <View style={{ marginVertical: 4 }} />
                           <View
                              style={{
                                 flexDirection: 'row',
                                 justifyContent: 'space-between',
                                 marginBottom: 6
                              }}
                           >
                              <Text style={{ flex: 0.8 }}>Angkutan</Text>
                              <Text style={{ flex: 1 }}>
                                 :{' '}
                                 {data.transporter === Transporter.BUYER
                                    ? 'Pembeli'
                                    : 'Penjual'}
                              </Text>
                           </View>
                           <View
                              style={{
                                 flexDirection: 'row',
                                 justifyContent: 'space-between',
                                 marginBottom: 6
                              }}
                           >
                              <Text style={{ flex: 0.8 }}>Pengemudi</Text>
                              <Text style={{ flex: 1 }}>: {data.driver}</Text>
                           </View>
                           <View
                              style={{
                                 flexDirection: 'row',
                                 justifyContent: 'space-between',
                                 marginBottom: 6
                              }}
                           >
                              <Text style={{ flex: 0.8 }}>Kendaraan</Text>
                              <Text style={{ flex: 1 }}>: {data.plateNo}</Text>
                           </View>
                           <View style={{ marginVertical: 4 }} />
                           <View
                              style={{
                                 flexDirection: 'row',
                                 justifyContent: 'space-between',
                                 marginBottom: 6
                              }}
                           >
                              <Text style={{ flex: 0.8 }}>Masuk</Text>
                              <Text style={{ flex: 1 }}>
                                 : {formatDate(data.entryTime)}
                              </Text>
                           </View>
                           <View
                              style={{
                                 flexDirection: 'row',
                                 justifyContent: 'space-between',
                                 marginBottom: 6
                              }}
                           >
                              <Text style={{ flex: 0.8 }}>Keluar</Text>
                              <Text style={{ flex: 1 }}>
                                 :{' '}
                                 {data.exitTime
                                    ? formatDate(data.exitTime)
                                    : 'N/A'}
                              </Text>
                           </View>
                        </View>

                        {/* Right Column */}
                        <View style={{ flex: 1, paddingLeft: '2cm' }}>
                           <View style={{ marginBottom: 2 }}>
                              <Text>Pengambilan</Text>
                           </View>
                           <View style={{ marginBottom: 6 }}>
                              <Text>{data.order?.orderNo}</Text>
                           </View>
                           {data.splitOrder && (
                              <>
                                 <View style={{ marginVertical: 4 }} />
                                 <View style={{ marginBottom: 2 }}>
                                    <Text>Tiket Sambungan</Text>
                                 </View>
                                 <View style={{ marginBottom: 6 }}>
                                    <Text>{data.splitOrder.ticketNo}</Text>
                                 </View>
                              </>
                           )}
                           <View style={{ marginVertical: 4 }} />
                           <View
                              style={{
                                 flexDirection: 'row',
                                 justifyContent: 'space-between',
                                 marginBottom: 6
                              }}
                           >
                              <Text style={{ flex: 1 }}>Tara</Text>
                              <Text style={{ flex: 1 }}>
                                 : {formatNumber(data.weightIn)} Kg
                              </Text>
                           </View>
                           <View
                              style={{
                                 flexDirection: 'row',
                                 justifyContent: 'space-between',
                                 marginBottom: 6
                              }}
                           >
                              <Text style={{ flex: 1 }}>Bruto</Text>
                              <Text style={{ flex: 1 }}>
                                 :{' '}
                                 {data.weightOut
                                    ? formatNumber(data.weightOut)
                                    : 'N/A'}{' '}
                                 Kg
                              </Text>
                           </View>
                           <View
                              style={{
                                 flexDirection: 'row',
                                 justifyContent: 'space-between',
                                 marginBottom: 6
                              }}
                           >
                              <Text style={{ flex: 1 }}>Neto</Text>
                              <Text style={{ flex: 1 }}>
                                 :{' '}
                                 {data.weightOut
                                    ? formatNumber(
                                         data.weightOut - data.weightIn
                                      )
                                    : 'N/A'}{' '}
                                 Kg
                              </Text>
                           </View>
                        </View>
                     </View>
                  </View>
                  <View>
                     <View style={{ marginBottom: 6 }}>
                        <Text>Segel {data.seal ? `${data.seal}` : 'N/A'}</Text>
                     </View>
                     <View
                        style={{ marginBottom: 6, fontFamily: 'Times-Italic' }}
                     >
                        <Text>
                           {data.broken ? `Broken (${data.broken} %), ` : ''}
                           {data.moist ? `Moist (${data.moist} %), ` : ''}
                           {data.so ? `SO (${data.so} %), ` : ''}
                           {data.sto ? `STO (${data.sto} %), ` : ''}
                           {data.ffa ? `FFA (${data.ffa} %), ` : ''}
                           {data.dirty ? `Dirty(${data.dirty} %), ` : ''}
                           {data.fiber ? `Fiber(${data.fiber} %)` : ''}
                        </Text>
                     </View>
                  </View>

                  {/* Footer */}
                  <View
                     style={{
                        marginTop: '0.2cm',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        fontFamily: 'Times-Roman',
                        fontSize: 12
                     }}
                  >
                     {/* First column: Operator */}
                     <View
                        style={{
                           borderTop: 1,
                           borderRight: 1,
                           borderLeft: 1,
                           borderColor: 'black',
                           flex: 1,
                           alignItems: 'center'
                        }}
                     >
                        <Text
                           style={{
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        >
                           Dicetak
                        </Text>
                        <View
                           style={{
                              height: '1.7cm',
                              width: '100%',
                              borderBottom: 1
                           }}
                        />
                        <Text
                           style={{
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        >
                           {user.name}
                        </Text>
                        <Text
                           style={{
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        >
                           Operator
                        </Text>
                     </View>

                     {/* Second column: Mill KTU */}
                     <View
                        style={{
                           borderTop: 1,
                           borderRight: 1,
                           borderColor: 'black',
                           flex: 1,
                           alignItems: 'center'
                        }}
                     >
                        <Text
                           style={{
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        >
                           Diketahui
                        </Text>
                        <View
                           style={{
                              height: '1.7cm',
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        />
                        <Text
                           style={{
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        >
                           {' '}
                        </Text>
                        <Text
                           style={{
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        >
                           Mill KTU
                        </Text>
                     </View>

                     {/* Second column: Mill KTU */}
                     <View
                        style={{
                           borderTop: 1,
                           borderRight: 1,
                           borderColor: 'black',
                           flex: 1,
                           alignItems: 'center'
                        }}
                     >
                        <Text
                           style={{
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        >
                           Disetujui
                        </Text>
                        <View
                           style={{
                              height: '1.7cm',
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        />
                        <Text
                           style={{
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        >
                           {' '}
                        </Text>
                        <Text
                           style={{
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        >
                           Mill Manager
                        </Text>
                     </View>

                     {/* Fouth column: Driver */}
                     <View
                        style={{
                           borderTop: 1,
                           borderRight: 1,
                           borderColor: 'black',
                           flex: 1,
                           alignItems: 'center'
                        }}
                     >
                        <Text
                           style={{
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        >
                           Dibawa
                        </Text>
                        <View
                           style={{
                              height: '1.7cm',
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        />
                        <Text
                           style={{
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        >
                           {data.driver}
                        </Text>
                        <Text
                           style={{
                              width: '100%',
                              borderBottom: 1,
                              textAlign: 'center'
                           }}
                        >
                           Driver
                        </Text>
                     </View>
                  </View>
               </Page>
            );
         })}
      </Document>
   );
}

export function Ticket({ data }: TicketProps) {
   const user = useCurrentUser();
   const companyName =
      process.env.NEXT_PUBLIC_COMPANY_NAME || 'Default Company Name';
   const companyTagline =
      process.env.NEXT_PUBLIC_COMPANY_TAGLINE || 'Default Tagline';
   const companyLogo =
      process.env.NEXT_PUBLIC_COMPANY_LOGO || '/logo.png';
   const millName =
      data.order?.contract?.location?.name || 'Pabrik Kelapa Sawit';

   if (!user || !data.exitTime) return;

   const tickets = [
      { ...data },
      ...(data.splitOrder ? [{ ...data.splitOrder }] : [])
   ];

   return (
      <BlobProvider
         document={
            <TicketDocument
               tickets={tickets}
               user={user}
               companyLogo={companyLogo}
               companyName={companyName}
               companyTagline={companyTagline}
               millName={millName}
            />
         }
      >
         {({ url, error }) => {
            if (error) {
               // console.log(error)
               toast.error('Terjadi kesalahan saat membuat tiket');
               return;
            }

            const handlePreview = () => {
               if (url) {
                  window.open(url, '_blank');
                  toast.success('Pratinjau tiket telah di buka');
               } else {
                  // console.error('PDF URL is not available', error);
                  toast.error('Gagal membuka pratinjau tiket');
               }
            };

            return (
               <div
                  className="flex cursor-pointer items-center gap-2"
                  onClick={handlePreview}
               >
                  <Printer className="size-4" />
                  Cetak Tiket
               </div>
            );
         }}
      </BlobProvider>
   );
}
