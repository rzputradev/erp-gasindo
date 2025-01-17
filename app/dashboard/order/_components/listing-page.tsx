import { Prisma } from '@prisma/client';

import { db } from '@/lib/db';
import { searchContractParamsCache } from '@/lib/params/contract';

import { columns } from './tables/columns';
import { DataTable } from '@/components/ui/table/data-table';

export async function ListingPage() {
   const page = searchContractParamsCache.get('page');
   const search = searchContractParamsCache.get('q');
   const pageLimit = searchContractParamsCache.get('limit');
   const location = searchContractParamsCache.get('location');
   const locationArray = location ? (location.split('.') as string[]) : [];
   const buyer = searchContractParamsCache.get('buyer');
   const buyerArray = buyer ? (buyer.split('.') as string[]) : [];
   const item = searchContractParamsCache.get('item');
   const itemArray = item ? (item.split('.') as string[]) : [];

   const filters: Prisma.ContractFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            OR: [
               { contractNo: { contains: search, mode: 'insensitive' } },
               { item: { name: { contains: search, mode: 'insensitive' } } },
               { location: { name: { contains: search, mode: 'insensitive' } } }
            ]
         }),
         ...(locationArray.length > 0 && {
            locationId: {
               in: locationArray
            }
         }),
         ...(buyerArray.length > 0 && {
            buyerId: {
               in: buyerArray
            }
         }),
         ...(itemArray.length > 0 && {
            itemId: {
               in: itemArray
            }
         })
      },
      include: {
         buyer: true,
         item: true,
         location: true
      },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.contract.findMany(filters),
      db.contract.count({ where: filters.where })
   ]);

   return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
