import { Suspense } from 'react';
import { unauthorized } from 'next/navigation';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { checkPermissions, currentUser } from '@/data/user';
import { Order, Prisma, SalesStatus } from '@prisma/client';
import { db } from '@/lib/db';

export const metadata = {
   title: 'Dashboard : Tambah Pembeli'
};

export default async function Page() {
   const user = await currentUser();

   const access = await checkPermissions(user, ['outgoing:create']);
   const manualInput = await checkPermissions(user, ['outgoing:manual']);
   const multiLocationAccess = await checkPermissions(user, [
      'outgoing:multi-location'
   ]);
   if (!access) return unauthorized();

   if (!user) {
      return unauthorized();
   }

   if (!multiLocationAccess && !user.location) {
      return (
         <PageContainer scrollable>
            <div className="flex-1 space-y-4">
               <Suspense fallback={<FormCardSkeleton />}>
                  <CreateForm orders={[]} manualInput={manualInput} />
               </Suspense>
            </div>
         </PageContainer>
      );
   }

   const where: Prisma.OrderWhereInput = {
      status: SalesStatus.ACTIVE,
      remainingQty: { gt: 0 },
      contract: { status: SalesStatus.ACTIVE }
   };

   if (!multiLocationAccess) {
      where.contract = {
         ...where.contract,
         location: {
            ...where.contract?.location,
            key: user?.location
         } as any
      };
   }

   const orders: Order[] = await db.order.findMany({ where });

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <CreateForm orders={orders} manualInput={manualInput} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
