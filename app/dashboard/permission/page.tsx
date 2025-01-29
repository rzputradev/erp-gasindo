import { SearchParams } from 'nuqs/server';
import React, { Suspense } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { unauthorized } from 'next/navigation';

import { cn } from '@/lib/utils';
import { checkPermissions, currentUser } from '@/data/user';
import { searchBaseParamsCache, serialize } from '@/lib/params/base';

import { ListingPage } from './_components/listing-page';
import { TableAction } from './_components/tables/table-action';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Izin'
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const searchParams = await props.searchParams;
   searchBaseParamsCache.parse(searchParams);

   const createAccess = await checkPermissions(user, ['permission:create']);
   const readAccess = await checkPermissions(user, ['permission:read']);
   if (!readAccess) return unauthorized();

   const key = serialize({ ...searchParams });

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading title={`Izin`} description="Kelola data izin" />
               {createAccess && (
                  <Link href={'/dashboard/permission/create'}>
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
               fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
            >
               <ListingPage />
            </Suspense>
         </div>
      </PageContainer>
   );
}
