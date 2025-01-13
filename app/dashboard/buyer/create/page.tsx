import { Suspense } from 'react';
import { unauthorized } from 'next/navigation';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { checkPermissions } from '@/data/user';

export const metadata = {
   title: 'Dashboard : Tambah Pembeli'
};

export default async function Page() {
   const access = await checkPermissions(['buyer:create']);
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
