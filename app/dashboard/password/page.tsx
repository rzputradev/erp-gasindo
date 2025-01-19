import PageContainer from '@/components/layout/page-container';
import { ChangePasswordForm } from './_components/update-form';
import { currentUser } from '@/data/user';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { User } from '@prisma/client';
import { Suspense } from 'react';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Ganti Password'
};

export default async function Page() {
   const user = await currentUser();

   if (!user) return notFound();

   const userDb: User | null = await db.user.findUnique({
      where: { id: user.id }
   });

   if (!userDb) return notFound();

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <ChangePasswordForm data={userDb} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
