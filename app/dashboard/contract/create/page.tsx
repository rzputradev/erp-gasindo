import { Suspense } from 'react';
import { unauthorized } from 'next/navigation';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { checkPermissions } from '@/data/user';
import { Buyer, Item, Location } from '@prisma/client';
import { db } from '@/lib/db';

export const metadata = {
   title: 'Dashboard : Tambah Kontrak'
};

export default async function Page() {
   const access = await checkPermissions(['contract:create']);
   if (!access) return unauthorized();

   const locations: Location[] = await db.location.findMany({
      where: { type: 'MILL' }
   });
   const buyers: Buyer[] = await db.buyer.findMany();
   const items: any = await db.item.findMany({
      where: {
         AND: [
            { categories: { some: { key: 'commodity' } } },
            { categories: { some: { key: 'weighing' } } }
         ]
      }
   });

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <CreateForm
                  buyers={buyers}
                  items={items}
                  locations={locations}
               />
            </Suspense>
         </div>
      </PageContainer>
   );
}
