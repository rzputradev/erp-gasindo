import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { checkPermissions, currentUser } from '@/data/user';
import { searchIncomingParamsCache, serialize } from '@/lib/params/incoming';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { db } from '@/lib/db';
import { Buyer, Item, Location, Supplier } from '@prisma/client';
import { unauthorized } from 'next/navigation';
import { ListingPage } from './_components/listing-page';
import { TableAction } from './_components/tables/table-action';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Barang Masuk'
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const searchParams = await props.searchParams;
   searchIncomingParamsCache.parse(searchParams);

   const readAccess = await checkPermissions(user, ['incoming:read']);
   const createAccess = await checkPermissions(user, ['incoming:create']);
   const multiLocationAccess = await checkPermissions(user, [
      'incoming:multi-location'
   ]);

   if (!readAccess) return unauthorized();

   const key = serialize({ ...searchParams });

   const locations: Location[] = await db.location.findMany({
      where: { type: 'MILL' }
   });
   const suppliers: Supplier[] = await db.supplier.findMany();
   const items: Item[] = await db.item.findMany({
      where: {
         categories: {
            every: { key: { in: ['incoming-scale'] } }
         }
      }
   });

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading
                  title={`Barang Masuk`}
                  description="Kelola data timbangan barang masuk"
               />
               {createAccess && (
                  <Link href={'/dashboard/incoming/create'}>
                     <Button size={'sm'} className="flex items-center">
                        <Plus className="size 4" /> Tambah
                     </Button>
                  </Link>
               )}
            </div>
            <Separator />
            <TableAction
               locations={locations}
               suppliers={suppliers}
               items={items}
               multiLocationAccess={multiLocationAccess}
            />
            <Suspense
               key={key}
               fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
            >
               <ListingPage />
            </Suspense>
         </div>
      </PageContainer>
   );
}
