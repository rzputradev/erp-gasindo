import { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import { Location, Role, User } from '@prisma/client';
import { notFound } from 'next/navigation';

import { db } from '@/lib/db';

import { UpdateForm } from '../_components/form/update';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Perbaharui Pengguna'
};

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
   const { id } = await props.searchParams;

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
               <UpdateForm data={data} locations={locations} roles={roles} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
