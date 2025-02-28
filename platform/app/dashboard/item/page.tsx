import { SearchParams } from 'nuqs/server';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ItemCategory } from '@prisma/client';
import { unauthorized } from 'next/navigation';

import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { searchItemParamsCache, serialize } from '@/lib/params/item';
import { checkPermissions, currentUser } from '@/data/user';

import { ListingPage } from './_components/listing-page';
import { TableAction } from './_components/tables/table-action';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Barang'
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const searchParams = await props.searchParams;
   searchItemParamsCache.parse(searchParams);

   const readAccess = await checkPermissions(user, ['item:read']);
   const createAccess = await checkPermissions(user, ['item:create']);
   if (!readAccess) return unauthorized();

   const key = serialize({ ...searchParams });

   const itemCategories: ItemCategory[] = await db.itemCategory.findMany();

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading title={`Barang`} description="Kelola data barang" />
               {createAccess && (
                  <Link href={'/dashboard/item/create'}>
                     <Button size={'sm'} className="flex items-center">
                        <Plus className="size 4" /> Tambah
                     </Button>
                  </Link>
               )}
            </div>
            <Separator />
            <TableAction itemCategories={itemCategories} />
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
