import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { SearchParams } from 'nuqs';

import { db } from '@/lib/db';

import { UpdateForm } from '../_components/form/update';
import { Location, LocationType, Transporter } from '@prisma/client';
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

   const data: Transporter | null = await db.transporter.findUnique({
      where: { id: id as string }
   });

   const locations: Location[] = await db.location.findMany({
      where: {
         NOT: { type: LocationType.OFFICE }
      }
   });

   if (!data) {
      return notFound();
   }

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <UpdateForm data={data} locations={locations} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
