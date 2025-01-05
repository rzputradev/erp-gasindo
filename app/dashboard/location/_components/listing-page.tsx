import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { searchLocationParamsCache } from '@/lib/params/location';
import { Location, LocationType, Prisma } from '@prisma/client';
import { Table } from './tables';
import { db } from '@/lib/db';

import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

type LocationListingPage = {};

export async function ListingPage({}: LocationListingPage) {
   const page = searchLocationParamsCache.get('page');
   const search = searchLocationParamsCache.get('q');
   const pageLimit = searchLocationParamsCache.get('limit');
   const type = searchLocationParamsCache.get('type');
   const typeArray = type ? (type.split('.') as LocationType[]) : [];

   const filters: Prisma.LocationFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [{ name: { contains: search, mode: 'insensitive' } }]
         }),
         ...(typeArray.length > 0 && {
            type: {
               in: typeArray
            }
         })
      },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.location.findMany(filters),
      db.location.count({ where: filters.where })
   ]);
   const locations: Location[] = data;

   return (
      <PageContainer scrollable>
         <div className="space-y-4">
            <div className="flex items-start justify-between">
               <Heading
                  title={`Lokasi (${totalData})`}
                  description="Kelola lokasi"
               />
               <Link
                  href={'/dashboard/location/create'}
                  className={cn(buttonVariants({ variant: 'default' }))}
               >
                  <Plus className="mr-2 h-4 w-4" /> Tambah
               </Link>
            </div>
            <Separator />
            <Table data={locations} totalData={totalData} />
         </div>
      </PageContainer>
   );
}
