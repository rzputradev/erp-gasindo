import { Suspense } from 'react';
import { unauthorized } from 'next/navigation';

import { checkPermissions, currentUser } from '@/data/user';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { db } from '@/lib/db';
import { LocationType } from '@prisma/client';

export const metadata = {
   title: 'Dashboard : Tambah Pemasok'
};

export default async function Page() {
   const user = await currentUser();
   const access = await checkPermissions(user, ['supplier:create']);
   if (!access) return unauthorized();

   const locations = await db.location.findMany({
      where: { type: LocationType.MILL }
   });
   const suppliers = await db.supplier.findMany();
   const items = await db.item.findMany({
      where: {
         AND: [
            // { categories: { some: { key: 'commodity' } } },
            { categories: { some: { key: 'incoming-scale' } } }
         ]
      }
   });

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <CreateForm
                  locations={locations}
                  suppliers={suppliers}
                  items={items}
               />
            </Suspense>
         </div>
      </PageContainer>
   );
}
