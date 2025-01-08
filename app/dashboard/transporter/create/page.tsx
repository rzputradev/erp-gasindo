import PageContainer from '@/components/layout/page-container';
import { CreateForm } from '../_components/form/create';
import { Location, LocationType } from '@prisma/client';
import { db } from '@/lib/db';

export const metadata = {
   title: 'Dashboard : Tambah Pengangkutan'
};

export default async function Page() {
   const locations: Location[] = await db.location.findMany({
      where: {
         NOT: { type: LocationType.OFFICE }
      }
   });

   return (
      <PageContainer>
         <CreateForm locations={locations} />
      </PageContainer>
   );
}
