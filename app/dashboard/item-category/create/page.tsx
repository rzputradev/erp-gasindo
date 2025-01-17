import { Suspense } from 'react';
import { unauthorized } from 'next/navigation';

import { checkPermissions } from '@/data/user';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Tambah Kategori Barang'
};

export default async function Page() {
   const access = await checkPermissions(['item-category:create']);
   if (!access) return unauthorized();

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <CreateForm />
            </Suspense>
         </div>
      </PageContainer>
   );
}
