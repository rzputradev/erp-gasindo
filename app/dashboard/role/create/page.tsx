import { Permission } from '@prisma/client';
import { Suspense } from 'react';

import { db } from '@/lib/db';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Tambah Role'
};

export default async function Page() {
   const permissions: Permission[] = await db.permission.findMany({
      orderBy: { name: 'asc' }
   });

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <CreateForm permissions={permissions} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
