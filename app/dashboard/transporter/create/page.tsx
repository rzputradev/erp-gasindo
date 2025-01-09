import { Location, LocationType } from '@prisma/client';
import { Suspense } from 'react';

import { db } from '@/lib/db';

import { CreateForm } from '../_components/form/create';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';

export const metadata = {
   title: 'Dashboard : Tambah Pengangkutan'
};

export default async function Page() {
   const locations: Location[] = await db.location.findMany({
      where: {
         NOT: { type: LocationType.OFFICE }
      }
   });

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <CreateForm locations={locations} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
