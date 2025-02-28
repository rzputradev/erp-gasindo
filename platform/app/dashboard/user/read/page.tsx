import { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import { Location, Role, User } from '@prisma/client';
import { notFound, unauthorized } from 'next/navigation';

import { db } from '@/lib/db';

import { UpdateForm } from '../_components/form/update';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { checkPermissions, currentUser } from '@/data/user';
import { ViewDetail } from '../_components/view-detail';

export const metadata = {
   title: 'Dashboard : Rincian Pengguna'
};

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const { id } = await props.searchParams;
   const access = await checkPermissions(user, ['user:read']);

   if (!access) return unauthorized();

   if (!id) {
      return notFound();
   }

   const locations: Location[] = await db.location.findMany();
   const roles: Role[] = await db.role.findMany();
   const data: User | null = await db.user.findUnique({
      where: { id: id as string }
   });

   if (!data) {
      return notFound();
   }

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <ViewDetail data={data} locations={locations} roles={roles} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
