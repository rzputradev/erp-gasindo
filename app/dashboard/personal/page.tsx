import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { User } from '@prisma/client';

import { db } from '@/lib/db';
import { currentUser } from '@/data/user';

import { UpdateForm } from './_components/update-form';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

export const metadata = {
   title: 'Dashboard : Info Pribadi'
};

export default async function Page() {
   const user = await currentUser();

   if (!user) return notFound();

   const userDb: User | null = await db.user.findUnique({
      where: { id: user.id },
      include: {
         location: true,
         role: true
      }
   });

   if (!userDb) return notFound();

   return (
      <PageContainer scrollable>
         <div className="flex-1 space-y-4">
            <Suspense fallback={<FormCardSkeleton />}>
               <UpdateForm data={userDb} />
            </Suspense>
         </div>
      </PageContainer>
   );
}
