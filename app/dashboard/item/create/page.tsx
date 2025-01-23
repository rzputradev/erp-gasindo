import { Suspense } from 'react';
import { ItemCategory } from '@prisma/client';
import { unauthorized } from 'next/navigation';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Tambah Barang'
};

export default async function Page() {
   const user = await currentUser();
   const itemTypes: ItemCategory[] = await db.itemCategory.findMany();

   const access = await checkPermissions(user, ['item:create']);
   if (!access) return unauthorized();

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <CreateForm itemCategories={itemTypes} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
