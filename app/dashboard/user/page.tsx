import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Location, Role } from '@prisma/client';

import { cn } from '@/lib/utils';
import { db } from '@/lib/db';
import { searchUserParamsCache, serialize } from '@/lib/params/user';

import { ListingPage } from './_components/listing-page';
import { TableAction } from './_components/tables/table-action';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { buttonVariants } from '@/components/ui/button';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export const metadata = {
   title: 'Dashboard : Pengguna'
};

export default async function Page(props: pageProps) {
   const searchParams = await props.searchParams;
   searchUserParamsCache.parse(searchParams);

   const key = serialize({ ...searchParams });

   const locations: Location[] = await db.location.findMany();
   const roles: Role[] = await db.role.findMany();

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading
                  title={`Pengguna`}
                  description="Kelola data pengguna dan hak akses"
               />
               <Link
                  href={'/dashboard/user/create'}
                  className={cn(buttonVariants({ variant: 'default' }))}
               >
                  <Plus className="mr-2 h-4 w-4" /> Tambah
               </Link>
            </div>
            <Separator />
            <TableAction locations={locations} roles={roles} />
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
