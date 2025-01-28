import { notFound, unauthorized } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';

import { checkPermissions, currentUser } from '@/data/user';
import { db } from '@/lib/db';

import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { UpdateForm } from '../_components/form/update';

export const metadata = {
   title: 'Dashboard : Perbaharui Pembeli'
};

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const { id } = await props.searchParams;

   const access = await checkPermissions(user, ['buyer:update']);
   if (!access) return unauthorized();

   if (!id) {
      return notFound();
   }

   const data: any = await db.outgoingScale.findUnique({
      where: { id: id as string },
      include: { order: true }
   });

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
