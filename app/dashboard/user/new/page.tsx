import { ScrollArea } from '@/components/ui/scroll-area';
import PageContainer from '@/components/layout/page-container';
import { AddUserForm } from '../_components/user-form';
import { db } from '@/lib/db';
import { RoleWithLocation } from '@/types/role';

export const metadata = {
   title: 'Dashboard : Tambah Pengguna'
};

export default async function UserViewPage() {
   const roles: RoleWithLocation[] = await db.role.findMany({
      include: { location: true },
   });

   return (
      <PageContainer>
         <AddUserForm roles={roles} />
      </PageContainer>
   );
}
