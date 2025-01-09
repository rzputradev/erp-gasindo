import { Suspense } from 'react';
import { ItemType } from '@prisma/client';

import { db } from '@/lib/db';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Tambah Izin'
};

export default async function Page() {
   const itemTypes: ItemType[] = await db.itemType.findMany();

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <CreateForm itemTypes={itemTypes} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
