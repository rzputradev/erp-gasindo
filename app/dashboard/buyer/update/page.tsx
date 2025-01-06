import PageContainer from '@/components/layout/page-container';
import { db } from '@/lib/db';
import { UpdateForm } from '../_components/form/update';
import { notFound } from 'next/navigation';
import { SearchParams } from 'nuqs';

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

   const data = await db.buyer.findUnique({ where: { id: id as string } });

   if (!data) {
      return notFound();
   }

   return (
      <PageContainer>
         <UpdateForm data={data} />
      </PageContainer>
   );
}
