import PageContainer from '@/components/layout/page-container';
import { db } from '@/lib/db';
import { CreateForm } from '../_components/form/create';
import { Location, Permission } from '@prisma/client';

export const metadata = {
   title: 'Dashboard : Tambah Role'
};

export default async function Page() {
   const permissions: Permission[] = await db.permission.findMany({
      orderBy: { key: 'asc' }
   });

   return (
      <PageContainer>
         <CreateForm permissions={permissions} />
      </PageContainer>
   );
}
