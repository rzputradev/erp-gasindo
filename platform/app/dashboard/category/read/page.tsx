import { notFound, unauthorized } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';

import { db } from '@/lib/db';
import { checkPermissions, currentUser } from '@/data/user';

import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { ViewDetail } from '../_components/view-detail';

export const metadata = {
   title: 'Dashboard : Rincian Kategori Barang'
};

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
   const user = await currentUser();
   const { id } = await props.searchParams;

   const access = await checkPermissions(user, ['category:read']);
   if (!access) return unauthorized();

   if (!id) {
      return notFound();
   }

   const data = await db.itemCategory.findUnique({
      where: { id: id as string }
   });

   if (!data) {
      return notFound();
   }

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <ViewDetail data={data} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
