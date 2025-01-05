import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Table } from './tables';
import { db } from '@/lib/db';
import { Location, LocationType, Prisma, Role } from '@prisma/client';
import { searchRoleParamsCache } from '@/lib/params/role';

export async function ListingPage() {
   // Showcasing the use of search params cache in nested RSCs
   const page = searchRoleParamsCache.get('page');
   const search = searchRoleParamsCache.get('q');
   const pageLimit = searchRoleParamsCache.get('limit');

   const filters: Prisma.RoleFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [{ name: { contains: search, mode: 'insensitive' } }]
         })
      },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.role.findMany(filters),
      db.role.count({ where: filters.where })
   ]);

   const datas: Role[] = data;

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading
                  title={`Role (${totalData})`}
                  description="Kelola hak akses"
               />
               <Link
                  href={'/dashboard/role/create'}
                  className={cn(buttonVariants({ variant: 'default' }))}
               >
                  <Plus className="mr-2 h-4 w-4" /> Tambah
               </Link>
            </div>
            <Separator />
            <Table data={datas} totalData={totalData} />
         </div>
      </PageContainer>
   );
}
