import { Plus } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { LocationType } from '@prisma/client';
import { SearchParams } from 'nuqs/server';
import React, { Suspense } from 'react';

import { cn } from '@/lib/utils';
import {
   searchTransporterParamsCache,
   serialize
} from '@/lib/params/transporter';

import { ListingPage } from './_components/listing-page';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { TableAction } from './_components/tables/table-action';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Pengangkutan'
};

export default async function Page(props: pageProps) {
   const searchParams = await props.searchParams;
   searchTransporterParamsCache.parse(searchParams);

   const key = serialize({ ...searchParams });

   const locations = await db.location.findMany({
      where: { NOT: { type: LocationType.OFFICE } }
   });

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading
                  title={`Pengangkutan`}
                  description="Kelola data pengangkutan"
               />
               <Link
                  href={'/dashboard/transporter/create'}
                  className={cn(buttonVariants({ variant: 'default' }))}
               >
                  <Plus className="mr-2 h-4 w-4" /> Tambah
               </Link>
            </div>
            <Separator />
            <TableAction locations={locations} />
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
