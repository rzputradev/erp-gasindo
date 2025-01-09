import { db } from '@/lib/db';
import { Location, Role } from '@prisma/client';
import { Suspense } from 'react';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Tambah Pengguna'
};

export default async function Page() {
   const locations: Location[] = await db.location.findMany();
   const roles: Role[] = await db.role.findMany();

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <CreateForm locations={locations} roles={roles} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
