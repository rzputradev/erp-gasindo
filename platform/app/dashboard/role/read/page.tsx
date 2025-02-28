import { notFound, unauthorized } from 'next/navigation';
import { Permission } from '@prisma/client';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';

import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { ViewDetail } from '../_components/view-detail';

export const metadata = {
   title: 'Dashboard : Rincian Peran'
};

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const { id } = await props.searchParams;

   const access = await checkPermissions(user, ['role:read']);
   if (!access) return unauthorized();

   if (!id) {
      return notFound();
   }

   const data = await db.role.findUnique({
      where: { id: id as string },
      include: { permissions: true }
   });

   const permissions: Permission[] = await db.permission.findMany({
      orderBy: { key: 'asc' }
   });

   if (!data) {
      return notFound();
   }

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <ViewDetail data={data} allPermissions={permissions} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
