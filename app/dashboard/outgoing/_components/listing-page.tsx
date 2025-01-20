import { Prisma } from '@prisma/client';

import { db } from '@/lib/db';
import { searchSaleParamsCache } from '@/lib/params/sales';

import { columns } from './tables/columns';
import { DataTable } from '@/components/ui/table/data-table';

export async function ListingPage() {
   const page = searchSaleParamsCache.get('page');
   const search = searchSaleParamsCache.get('q');
   const pageLimit = searchSaleParamsCache.get('limit');
   const location = searchSaleParamsCache.get('location');
   const locationArray = location ? (location.split('.') as string[]) : [];
   const buyer = searchSaleParamsCache.get('buyer');
   const buyerArray = buyer ? (buyer.split('.') as string[]) : [];
   const item = searchSaleParamsCache.get('item');
   const itemArray = item ? (item.split('.') as string[]) : [];

   const filters: Prisma.BuyerFindManyArgs = {
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
      db.buyer.findMany(filters),
      db.buyer.count({ where: filters.where })
   ]);

   return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
