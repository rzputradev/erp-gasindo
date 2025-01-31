import { notFound, unauthorized } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';

import { checkPermissions, currentUser } from '@/data/user';
import { db } from '@/lib/db';

import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { UpdateForm } from '../_components/form/update';
import { SalesStatus } from '@prisma/client';

export const metadata = {
   title: 'Dashboard : Perbaharui Pembeli'
};

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const { id } = await props.searchParams;

   const access = await checkPermissions(user, ['incoming:update']);
   const multiLocationAccess = await checkPermissions(user, [
      'incoming:multi-location'
   ]);
   if (!access || !user) return unauthorized();

   if (!id) {
      return notFound();
   }

   const data: any = await db.outgoingScale.findUnique({
      where: { id: id as string },
      include: { order: { include: { contract: true } } }
   });

   if (!data) {
      return notFound();
   }

   const products = await db.supplierItem.findMany({
      where: multiLocationAccess ? {} : { locationId: user.location },
      include: { supplier: true, item: true, location: true }
   });

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <UpdateForm data={data} products={products as any} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
