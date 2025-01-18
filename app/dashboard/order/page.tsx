import { SearchParams } from 'nuqs/server';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { checkPermissions } from '@/data/user';
import { searchOrderParamsCache, serialize } from '@/lib/params/order';
import { cn } from '@/lib/utils';

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
   title: 'Dashboard : Pengambilan'
};

export default async function Page(props: pageProps) {
   const searchParams = await props.searchParams;
   searchOrderParamsCache.parse(searchParams);

   const readAccess = await checkPermissions(['order:read']);
   const createAccess = await checkPermissions(['order:create']);
   if (!readAccess) return unauthorized();

   const key = serialize({ ...searchParams });

   const locations: Location[] = await db.location.findMany({
      where: { type: 'MILL' }
   });
   const buyers: Buyer[] = await db.buyer.findMany();
   const items: Item[] = await db.item.findMany({
      where: {
         categories: {
            every: { key: { in: ['commodity', 'weighing'] } }
         }
      }
   });

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading
                  title={`Pengambilan`}
                  description="Kelola data pengambilan"
               />
               {createAccess && (
                  <Link href={'/dashboard/order/create'}>
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
