import PageContainer from '@/components/layout/page-container';
import { CreateForm } from '../_components/form/create';
import { db } from '@/lib/db';
import { Location, Role } from '@prisma/client';

export const metadata = {
   title: 'Dashboard : Tambah Pengguna'
};

export default async function Page() {
   const locations: Location[] = await db.location.findMany();
   const roles: Role[] = await db.role.findMany();

   return (
      <PageContainer>
         <CreateForm locations={locations} roles={roles} />
      </PageContainer>
   );
}
