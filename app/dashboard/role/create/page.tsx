import { Permission } from '@prisma/client';
import { Suspense } from 'react';
import { unauthorized } from 'next/navigation';

import { db } from '@/lib/db';
import { checkPermissions } from '@/data/user';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Tambah Peran'
};

export default async function Page() {
   const permissions: Permission[] = await db.permission.findMany({
      orderBy: { key: 'asc' }
   });

   const access = await checkPermissions(['role:create']);
   if (!access) return unauthorized();

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
