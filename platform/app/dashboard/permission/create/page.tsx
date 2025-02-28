import { Suspense } from 'react';
import { unauthorized } from 'next/navigation';

import { checkPermissions, currentUser } from '@/data/user';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Tambah Izin'
};

export default async function Page() {
   const user = await currentUser();
   const access = await checkPermissions(user, ['permission:create']);
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
