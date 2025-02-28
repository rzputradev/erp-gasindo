import { Suspense } from 'react';
import { unauthorized } from 'next/navigation';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { checkPermissions, currentUser } from '@/data/user';
import { SupplierItem } from '@prisma/client';
import { db } from '@/lib/db';

export const metadata = {
   title: 'Dashboard : Tambah Pembeli'
};

export default async function Page() {
   const user = await currentUser();
   if (!user || !(await checkPermissions(user, ['incoming:create']))) {
      return unauthorized();
   }

   const [manualInput, multiLocationAccess] = await Promise.all([
      checkPermissions(user, ['incoming:manual']),
      checkPermissions(user, ['incoming:multi-location'])
   ]);

   if (!multiLocationAccess && !user.location) {
      return (
         <PageContainer scrollable>
            <div className="flex-1 space-y-4">
               <Suspense fallback={<FormCardSkeleton />}>
                  <CreateForm products={[]} manualInput={manualInput} />
               </Suspense>
            </div>
         </PageContainer>
      );
   }

   const products = await db.supplierItem.findMany({
      where: multiLocationAccess ? {} : { locationId: user.location },
      include: { supplier: true, item: true, location: true }
   });

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <CreateForm
                  products={products as any}
                  manualInput={manualInput}
               />
            </Suspense>
         </div>
      </PageContainer>
   );
}
