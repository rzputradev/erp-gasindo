import { Prisma } from '@prisma/client';

import { db } from '@/lib/db';

import { columns } from './tables/columns';
import { DataTable } from '@/components/ui/table/data-table';
import { searchOrderParamsCache } from '@/lib/params/order';

export async function ListingPage() {
   const page = searchOrderParamsCache.get('page');
   const search = searchOrderParamsCache.get('q');
   const pageLimit = searchOrderParamsCache.get('limit');
   const location = searchOrderParamsCache.get('location');
   const locationArray = location ? (location.split('.') as string[]) : [];
   const buyer = searchOrderParamsCache.get('buyer');
   const buyerArray = buyer ? (buyer.split('.') as string[]) : [];
   const item = searchOrderParamsCache.get('item');
   const itemArray = item ? (item.split('.') as string[]) : [];

   const filters: Prisma.OrderFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [
               { orderNo: { contains: search, mode: 'insensitive' } },
               {
                  contract: {
                     item: { name: { contains: search, mode: 'insensitive' } }
                  }
               },
               {
                  contract: {
                     location: {
                        name: { contains: search, mode: 'insensitive' }
                     }
                  }
               }
            ]
         }),
         ...(locationArray.length > 0 && {
            contract: {
               locationId: { in: locationArray }
            }
         }),
         ...(buyerArray.length > 0 && {
            contract: {
               buyerId: { in: buyerArray }
            }
         }),
         ...(itemArray.length > 0 && {
            contract: {
               itemId: { in: itemArray }
            }
         })
      },
      include: {
         contract: true
      },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.order.findMany(filters),
      db.order.count({ where: filters.where })
   ]);

   return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
