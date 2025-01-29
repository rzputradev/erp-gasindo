import { notFound, unauthorized } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';

import { UpdateForm } from '../_components/form/update';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { LocationType } from '@prisma/client';

export const metadata = {
   title: 'Dashboard : Perbaharui Pemasok'
};

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const { id } = await props.searchParams;

   const access = await checkPermissions(user, ['supplier:update']);
   if (!access) return unauthorized();

   if (!id) {
      return notFound();
   }

   const data = await db.supplierItem.findUnique({
      where: { id: id as string }
   });

   if (!data) {
      return notFound();
   }

   const locations = await db.location.findMany({
      where: { type: LocationType.MILL }
   });
   const suppliers = await db.supplier.findMany();
   const items = await db.item.findMany({
      where: {
         AND: [
            // { categories: { some: { key: 'commodity' } } },
            { categories: { some: { key: 'incoming-scale' } } }
         ]
      }
   });

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <UpdateForm
                  data={data}
                  locations={locations}
                  suppliers={suppliers}
                  items={items}
               />
            </Suspense>
         </div>
      </PageContainer>
   );
}
