import { notFound, unauthorized } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';

import { ExitForm } from '../_components/form/exit';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Perbaharui Pembeli'
};

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const { id } = await props.searchParams;
   const manualInput = await checkPermissions(user, ['outgoing:manual']);

   const access = await checkPermissions(user, ['outgoing:create']);
   if (!access) return unauthorized();

   if (!id) {
      return notFound();
   }

   const data = await db.outgoingScale.findUnique({
      where: { id: id as string }
   });

   if (!data) {
      return notFound();
   }

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <ExitForm
                  id={data.id}
                  ticketNo={data.ticketNo}
                  manualInput={manualInput}
               />
            </Suspense>
         </div>
      </PageContainer>
   );
}
