import PageContainer from '@/components/layout/page-container';
import { CreateForm } from '../_components/form/create';

export const metadata = {
   title: 'Dashboard : Tambah Pemasok'
};

export default async function Page() {
   return (
      <PageContainer>
         <CreateForm />
      </PageContainer>
   );
}
