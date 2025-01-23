import { SearchParams } from 'nuqs/server';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { unauthorized } from 'next/navigation';

import { checkPermissions, currentUser } from '@/data/user';
import { cn } from '@/lib/utils';
import { searchLocationParamsCache, serialize } from '@/lib/params/location';

import { ListingPage } from './_components/listing-page';
import { TableAction } from './_components/tables/table-action';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { buttonVariants } from '@/components/ui/button';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Lokasi'
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const searchParams = await props.searchParams;
   searchLocationParamsCache.parse(searchParams);

   const createAccess = await checkPermissions(user, ['location:create']);
   const readAccess = await checkPermissions(user, ['location:read']);
   if (!readAccess) return unauthorized();

   const key = serialize({ ...searchParams });

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading title={`Lokasi`} description="Kelola data lokasi" />
               {createAccess && (
                  <Link
                     href={'/dashboard/location/create'}
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
