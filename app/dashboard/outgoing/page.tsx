import { SearchParams } from 'nuqs/server';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { searchOutgoingParamsCache, serialize } from '@/lib/params/outgoing';
import { checkPermissions, currentUser } from '@/data/user';

import { TableAction } from './_components/tables/table-action';
import { ListingPage } from './_components/listing-page';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { unauthorized } from 'next/navigation';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Barang Keluar'
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const searchParams = await props.searchParams;
   searchOutgoingParamsCache.parse(searchParams);

   const readAccess = await checkPermissions(user, ['outgoing:read']);
   const createAccess = await checkPermissions(user, ['outgoing:create']);

   if (!readAccess) return unauthorized();

   const key = serialize({ ...searchParams });

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading
                  title={`Barang Keluar`}
                  description="Kelola data timbangan barang keluar"
               />
               {createAccess && (
                  <Link href={'/dashboard/outgoing/create'}>
                     <Button size={'sm'} className="flex items-center">
                        <Plus className="size 4" /> Tambah
                     </Button>
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
