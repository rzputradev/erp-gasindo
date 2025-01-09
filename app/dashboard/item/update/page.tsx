import PageContainer from '@/components/layout/page-container';
import { db } from '@/lib/db';
import { UpdateForm } from '../_components/form/update';
import { notFound } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { Item, ItemType } from '@prisma/client';
import { Suspense } from 'react';
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

   const data: Item | null = await db.item.findUnique({
      where: { id: id as string }
   });
   const itemTypes: ItemType[] = await db.itemType.findMany();

   if (!data) {
      return notFound();
   }

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <UpdateForm data={data} itemTypes={itemTypes} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
