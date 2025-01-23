import { Prisma } from '@prisma/client';

import { db } from '@/lib/db';
import { searchOutgoingParamsCache } from '@/lib/params/outgoing';

import { columns } from './tables/columns';
import { DataTable } from '@/components/ui/table/data-table';
import { checkPermissions, currentUser } from '@/data/user';
import { unauthorized } from 'next/navigation';

export async function ListingPage() {
   const user = await currentUser();
   const multiLocationAccess = await checkPermissions(user, [
      'outgoing:multi-location'
   ]);

   if (!user) return unauthorized();

   const page = searchOutgoingParamsCache.get('page') || 1;
   const search = searchOutgoingParamsCache.get('q');
   const pageLimit = searchOutgoingParamsCache.get('limit') || 10;
   const location = searchOutgoingParamsCache.get('location');
   const locationArray = location ? location.split('.') : [];
   const buyer = searchOutgoingParamsCache.get('buyer');
   const buyerArray = buyer ? buyer.split('.') : [];
   const item = searchOutgoingParamsCache.get('item');
   const itemArray = item ? item.split('.') : [];

   // If user lacks multi-location access and `user.location` is undefined, return empty data
   if (!multiLocationAccess && !user.location) {
      return <DataTable columns={columns} data={[]} totalItems={0} />;
   }

   // Build filters based on conditions
   const where: Prisma.OutgoingScaleWhereInput = {
      ...(search && {
         OR: [
            { ticketNo: { contains: search, mode: 'insensitive' } },
            { driver: { contains: search, mode: 'insensitive' } }
         ]
      }),
      ...(buyerArray.length > 0 && {
         order: { contract: { buyerId: { in: buyerArray } } }
      }),
      ...(itemArray.length > 0 && {
         order: { contract: { itemId: { in: itemArray } } }
      })
   };

   if (!multiLocationAccess) {
      where.order = {
         ...where.order,
         contract: {
            ...where.order?.contract!,
            location: {
               key: user.location!
            }
         } as any
      };
   }

   const filters: Prisma.OutgoingScaleFindManyArgs = {
      skip: (page - 1) * pageLimit,
      take: pageLimit,
      where,
      include: { order: true },
      orderBy: {
         createdAt: 'desc'
      }
   };

   const [data, totalData] = await Promise.all([
      db.outgoingScale.findMany(filters),
      db.outgoingScale.count({ where })
   ]);

   return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
