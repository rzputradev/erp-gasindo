import { db } from '@/lib/db';
import { Location, Role } from '@prisma/client';
import { Suspense } from 'react';
import { unauthorized } from 'next/navigation';

import { checkPermissions } from '@/data/user';

import { CreateForm } from '../_components/form/create';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Tambah Pengguna'
};

export default async function Page() {
   const access = await checkPermissions(['user:create']);
   if (!access) return unauthorized();

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
