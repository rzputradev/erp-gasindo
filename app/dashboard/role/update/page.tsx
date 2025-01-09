import { notFound } from 'next/navigation';
import { Permission } from '@prisma/client';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';

import { db } from '@/lib/db';

import { UpdateForm } from '../_components/form/update';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Perbaharui Lokasi'
};

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
   const { id } = await props.searchParams;

   if (!id) {
      return notFound();
   }

   const data = await db.role.findUnique({
      where: { id: id as string },
      include: { permissions: true }
   });
   const permissions: Permission[] = await db.permission.findMany();

   if (!data) {
      return notFound();
   }

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <UpdateForm data={data} allPermissions={permissions} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
