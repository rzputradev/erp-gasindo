import { SearchParams } from 'nuqs/server';
import React, { Suspense } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { unauthorized } from 'next/navigation';

import { cn } from '@/lib/utils';
import { searchBaseParamsCache, serialize } from '@/lib/params/base';
import { checkPermissions } from '@/data/user';

import { ListingPage } from './_components/listing-page';
import { TableAction } from './_components/tables/table-action';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Pemasok'
};

export default async function Page(props: pageProps) {
   const searchParams = await props.searchParams;
   searchBaseParamsCache.parse(searchParams);

   const readAccess = await checkPermissions(['supplier:read']);
   const createAccess = await checkPermissions(['supplier:create']);
   if (!readAccess) return unauthorized();

   const key = serialize({ ...searchParams });

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading title={`Pemasok`} description="Kelola data pemasok" />
               {createAccess && (
                  <Link
                     href={'/dashboard/supplier/create'}
                     className={cn(buttonVariants({ variant: 'default' }))}
                  >
                     <Plus className="mr-2 h-4 w-4" /> Tambah
                  </Link>
               )}
            </div>
            <Separator />
            <TableAction />
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
