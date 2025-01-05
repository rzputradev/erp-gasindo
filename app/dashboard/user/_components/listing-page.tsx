import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { searchUserParamsCache } from '@/lib/params/user';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Table from './tables';
import { db } from '@/lib/db';
import { Gender, Prisma, User } from '@prisma/client';

export async function ListingPage() {
   const page = searchUserParamsCache.get('page');
   const search = searchUserParamsCache.get('q');
   const pageLimit = searchUserParamsCache.get('limit');
   const location = searchUserParamsCache.get('location');
   const locationArray = location ? (location.split('.') as string[]) : [];
   const role = searchUserParamsCache.get('role');
   const roleArray = role ? (role.split('.') as string[]) : [];

   const filters: Prisma.UserFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [
               { name: { contains: search, mode: 'insensitive' } },
               { email: { contains: search, mode: 'insensitive' } }
            ]
         }),
         ...(locationArray.length > 0 && {
            locationId: {
               in: locationArray
            }
         }),
         ...(roleArray.length > 0 && {
            roleId: {
               in: roleArray
            }
         })
      },
      include: {
         role: true,
         location: true
      }
   };

   const [data, totalUsers] = await Promise.all([
      db.user.findMany(filters),
      db.user.count({ where: filters.where })
   ]);
   const users: User[] = data;

   const locations = await db.location.findMany();
   const roles = await db.role.findMany();

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading
                  title={`Pengguna (${totalUsers})`}
                  description="Kelola data pengguna dan hak akses"
               />
               <Link
                  href={'/dashboard/user/create'}
                  className={cn(buttonVariants({ variant: 'default' }))}
               >
                  <Plus className="mr-2 h-4 w-4" /> Tambah
               </Link>
            </div>
            <Separator />
            <Table
               data={users}
               totalData={totalUsers}
               locations={locations}
               roles={roles}
            />
         </div>
      </PageContainer>
   );
}
