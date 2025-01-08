import PageContainer from '@/components/layout/page-container';
import { CreateForm } from '../_components/form/create';
import { ItemType } from '@prisma/client';
import { db } from '@/lib/db';

export const metadata = {
   title: 'Dashboard : Tambah Izin'
};

export default async function Page() {
   const itemTypes: ItemType[] = await db.itemType.findMany();

   return (
      <PageContainer>
         <CreateForm itemTypes={itemTypes} />
      </PageContainer>
   );
}
