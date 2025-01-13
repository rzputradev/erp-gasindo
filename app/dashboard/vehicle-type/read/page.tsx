import { notFound, unauthorized } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { VehicleType } from '@prisma/client';
import { Suspense } from 'react';

import { db } from '@/lib/db';
import { checkPermissions } from '@/data/user';

import { ViewDetail } from '../_components/view-detail';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Rincian Tipe Kendaraan'
};

type pageProps = {
   searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
   const { id } = await props.searchParams;
   const access = await checkPermissions(['vehicle-type:read']);

   if (!access) return unauthorized();

   if (!id) {
      return notFound();
   }

   const data: VehicleType | null = await db.vehicleType.findUnique({
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
