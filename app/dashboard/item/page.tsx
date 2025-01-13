import { SearchParams } from 'nuqs/server';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ItemType } from '@prisma/client';
import { unauthorized } from 'next/navigation';

import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { searchItemParamsCache, serialize } from '@/lib/params/item';
import { checkPermissions } from '@/data/user';

import { ListingPage } from './_components/listing-page';
import { TableAction } from './_components/tables/table-action';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Item'
};

export default async function Page(props: pageProps) {
   const searchParams = await props.searchParams;
   searchItemParamsCache.parse(searchParams);

   const readAccess = await checkPermissions(['item:read']);
   const createAccess = await checkPermissions(['item:create']);
   if (!readAccess) return unauthorized();

   const key = serialize({ ...searchParams });

   const itemTypes: ItemType[] = await db.itemType.findMany();

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading title={`Item`} description="Kelola data item" />
               {createAccess && (
                  <Link
                     href={'/dashboard/item/create'}
                     className={cn(buttonVariants({ variant: 'default' }))}
                  >
                     <Plus className="mr-2 h-4 w-4" /> Tambah
                  </Link>
               )}
            </div>
            <Separator />
            <TableAction itemTypes={itemTypes} />
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
