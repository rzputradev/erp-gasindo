import { notFound, unauthorized } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';

import { db } from '@/lib/db';
import { checkPermissions } from '@/data/user';

import { UpdateForm } from '../_components/form/update';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Perbaharui Pemasok'
};

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
   const { id } = await props.searchParams;

   const access = await checkPermissions(['supplier:update']);
   if (!access) return unauthorized();

   if (!id) {
      return notFound();
   }

   const data = await db.supplier.findUnique({ where: { id: id as string } });

   if (!data) {
      return notFound();
   }

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <UpdateForm data={data} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
