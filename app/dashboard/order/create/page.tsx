import { Suspense } from 'react';
import { unauthorized } from 'next/navigation';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { checkPermissions } from '@/data/user';
import { Contract, SalesStatus } from '@prisma/client';
import { db } from '@/lib/db';

export const metadata = {
   title: 'Dashboard : Tambah Kontrak'
};

export default async function Page() {
   const access = await checkPermissions(['contract:create']);
   if (!access) return unauthorized();

   const contracts: Contract[] = await db.contract.findMany({
      where: {
         status: SalesStatus.ACTIVE,
         remainingQty: { gt: 0 }
      }
   });

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <CreateForm contracts={contracts} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
