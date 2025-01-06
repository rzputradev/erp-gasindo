import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Table } from './tables';
import { db } from '@/lib/db';
import { Buyer, Prisma, Supplier } from '@prisma/client';
import { searchBaseParamsCache } from '@/lib/params/base';

export async function ListingPage() {
   const page = searchBaseParamsCache.get('page');
   const search = searchBaseParamsCache.get('q');
   const pageLimit = searchBaseParamsCache.get('limit');

   const filters: Prisma.SupplierFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [
               { name: { contains: search, mode: 'insensitive' } },
               { key: { contains: search, mode: 'insensitive' } }
            ]
         })
      },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.supplier.findMany(filters),
      db.supplier.count({ where: filters.where })
   ]);
   const datas: Supplier[] = data;

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading
                  title={`Pembeli (${totalData})`}
                  description="Kelola data pembeli"
               />
               <Link
                  href={'/dashboard/supplier/create'}
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
