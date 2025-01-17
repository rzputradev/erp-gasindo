import { notFound, unauthorized } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';

import { db } from '@/lib/db';
import { checkPermissions } from '@/data/user';

import { ViewDetail } from '../_components/view-detail';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { Buyer, Item, Location } from '@prisma/client';

export const metadata = {
   title: 'Dashboard : Rincian Kontrak'
};

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
   const { id } = await props.searchParams;

   const access = await checkPermissions(['contract:read']);
   if (!access) return unauthorized();

   if (!id) {
      return notFound();
   }

   const data = await db.contract.findUnique({ where: { id: id as string } });

   if (!data) {
      return notFound();
   }

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
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <ViewDetail
                  data={data}
                  buyers={buyers}
                  items={items}
                  locations={locations}
               />
            </Suspense>
         </div>
      </PageContainer>
   );
}
