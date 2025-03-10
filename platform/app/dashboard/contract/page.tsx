import { SearchParams } from 'nuqs/server';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { checkPermissions, currentUser } from '@/data/user';
import { searchSaleParamsCache, serialize } from '@/lib/params/sales';

import { TableAction } from './_components/tables/table-action';
import { ListingPage } from './_components/listing-page';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { unauthorized } from 'next/navigation';
import { Buyer, Item, Location } from '@prisma/client';
import { db } from '@/lib/db';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Kontrak'
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const searchParams = await props.searchParams;
   searchSaleParamsCache.parse(searchParams);

   const readAccess = await checkPermissions(user, ['contract:read']);
   const createAccess = await checkPermissions(user, ['contract:create']);
   if (!readAccess) return unauthorized();

   const key = serialize({ ...searchParams });

   const locations: Location[] = await db.location.findMany({
      where: { type: 'MILL' }
   });
   const buyers: Buyer[] = await db.buyer.findMany();
   const items: Item[] = await db.item.findMany({
      where: {
         categories: {
            every: { key: { in: ['commodity', 'outgoing-scale'] } }
         }
      }
   });

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading title={`Kontrak`} description="Kelola data kontrak" />
               {createAccess && (
                  <Link href={'/dashboard/contract/create'}>
                     <Button size={'sm'} className="flex items-center">
                        <Plus className="size 4" /> Tambah
                     </Button>
                  </Link>
               )}
            </div>
            <Separator />
            <TableAction locations={locations} buyers={buyers} items={items} />
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
