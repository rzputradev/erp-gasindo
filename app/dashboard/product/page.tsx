import { SearchParams } from 'nuqs/server';
import React, { Suspense } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { unauthorized } from 'next/navigation';

import { cn } from '@/lib/utils';
import { searchOutgoingParamsCache, serialize } from '@/lib/params/product';
import { checkPermissions, currentUser } from '@/data/user';

import { ListingPage } from './_components/listing-page';
import { TableAction } from './_components/tables/table-action';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { db } from '@/lib/db';
import { Item, Location, Supplier } from '@prisma/client';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Pemasok'
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const searchParams = await props.searchParams;
   searchOutgoingParamsCache.parse(searchParams);

   const readAccess = await checkPermissions(user, ['product:read']);
   const createAccess = await checkPermissions(user, ['product:create']);
   if (!readAccess) return unauthorized();

   const key = serialize({ ...searchParams });

   const locations: Location[] = await db.location.findMany({
      where: { type: 'MILL' }
   });
   const suppliers: Supplier[] = await db.supplier.findMany();
   const items = await db.item.findMany({
      where: {
         AND: [
            // { categories: { some: { key: 'commodity' } } },
            { categories: { some: { key: 'incoming-scale' } } }
         ]
      }
   });

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading title={`Pemasok`} description="Kelola data pemasok" />
               {createAccess && (
                  <Link href={'/dashboard/product/create'}>
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
