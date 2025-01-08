import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Table } from './tables';
import { db } from '@/lib/db';
import { LocationType, Prisma, Transporter, VehicleType } from '@prisma/client';
import { searchTransporterParamsCache } from '@/lib/params/transporter';

export async function ListingPage() {
   const page = searchTransporterParamsCache.get('page');
   const search = searchTransporterParamsCache.get('q');
   const pageLimit = searchTransporterParamsCache.get('limit');

   const filters: Prisma.TransporterFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [{ name: { contains: search, mode: 'insensitive' } }]
         })
      },
      include: { location: true },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.transporter.findMany(filters),
      db.transporter.count({ where: filters.where })
   ]);
   const datas: Transporter[] = data;

   const locations = await db.location.findMany({
      where: { NOT: { type: LocationType.OFFICE } }
   });

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading
                  title={`Pengangkutan (${totalData})`}
                  description="Kelola data pengangkutan"
               />
               <Link
                  href={'/dashboard/transporter/create'}
                  className={cn(buttonVariants({ variant: 'default' }))}
               >
                  <Plus className="mr-2 h-4 w-4" /> Tambah
               </Link>
            </div>
            <Separator />
            <Table data={datas} totalData={totalData} locations={locations} />
         </div>
      </PageContainer>
   );
}
