import { Prisma } from '@prisma/client';

import { db } from '@/lib/db';
import { searchOutgoingParamsCache } from '@/lib/params/product';

import { columns } from './tables/columns';
import { DataTable } from '@/components/ui/table/data-table';

export async function ListingPage() {
   const page = searchOutgoingParamsCache.get('page');
   const search = searchOutgoingParamsCache.get('q');
   const pageLimit = searchOutgoingParamsCache.get('limit');
   const locations =
      searchOutgoingParamsCache.get('location')?.split('.') || [];
   const suppliers =
      searchOutgoingParamsCache.get('supplier')?.split('.') || [];
   const items = searchOutgoingParamsCache.get('item')?.split('.') || [];

   const filters: Prisma.SupplierItemFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where: {
         ...(search && {
            item: { name: { contains: search, mode: 'insensitive' } }
         }),
         AND: [
            ...(locations.length > 0
               ? [{ locationId: { in: locations } }]
               : []),
            ...(suppliers.length > 0
               ? [{ supplierId: { in: suppliers } }]
               : []),
            ...(items.length > 0 ? [{ itemId: { in: items } }] : [])
         ]
      },
      orderBy: {
         createdAt: 'desc'
      },
      include: {
         location: true,
         supplier: true,
         item: true
      }
   };

   const [data, totalData] = await Promise.all([
      db.supplierItem.findMany(filters),
      db.supplierItem.count({ where: filters.where })
   ]);

   return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
