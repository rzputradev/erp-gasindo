import { Prisma } from '@prisma/client';

import { db } from '@/lib/db';
import { searchItemParamsCache } from '@/lib/params/item';

import { columns } from './tables/columns';
import { DataTable } from '@/components/ui/table/data-table';

export async function ListingPage() {
   const page = searchItemParamsCache.get('page');
   const search = searchItemParamsCache.get('q');
   const pageLimit = searchItemParamsCache.get('limit');
   const itemType = searchItemParamsCache.get('itemType');
   const itemTypeArray = itemType ? (itemType.split('.') as string[]) : [];

   const filters: Prisma.ItemFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [
               { name: { contains: search, mode: 'insensitive' } },
               { key: { contains: search, mode: 'insensitive' } }
            ]
         }),
         ...(itemTypeArray.length > 0 && {
            typeId: {
               in: itemTypeArray
            }
         })
      },
      include: { itemType: true },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.item.findMany(filters),
      db.item.count({ where: filters.where })
   ]);

   return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
