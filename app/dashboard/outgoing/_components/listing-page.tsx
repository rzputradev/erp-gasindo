import { Prisma } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

import { db } from '@/lib/db';
import { searchOutgoingParamsCache } from '@/lib/params/outgoing';

import { columns } from './tables/columns';
import { DataTable } from '@/components/ui/table/data-table';
import { checkPermissions, currentUser } from '@/data/user';
import { unauthorized } from 'next/navigation';

export async function ListingPage() {
   const user = await currentUser();
   const today = new Date();
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
   const dateRange = searchOutgoingParamsCache.get('dateRange');

   // If user lacks multi-location access and `user.location` is undefined, return empty data
   if (!multiLocationAccess && !user.location) {
      return <DataTable columns={columns} data={[]} totalItems={0} />;
   }

   // Build filters based on conditions
   const where: Prisma.OutgoingScaleWhereInput = {
      ...(search && {
         ticketNo: { contains: search, mode: 'insensitive' }
         // OR: [
         //    { ticketNo: { contains: search, mode: 'insensitive' } },
         //    { driver: { contains: search, mode: 'insensitive' } }
         // ]
      }),
      ...(locationArray.length > 0 &&
         multiLocationAccess && {
            order: { contract: { locationId: { in: locationArray } } }
         }),
      ...(buyerArray.length > 0 && {
         order: { contract: { buyerId: { in: buyerArray } } }
      }),
      ...(itemArray.length > 0 && {
         order: { contract: { itemId: { in: itemArray } } }
      })
   };

   if (!search) {
      const dateFilter =
         dateRange?.from && dateRange?.to
            ? { gte: startOfDay(dateRange.from), lte: endOfDay(dateRange.to) }
            : { gte: startOfDay(today) };

      where.OR = [
         { createdAt: dateFilter },
         ...(dateRange?.from && dateRange?.to ? [] : [{ exitTime: null }])
      ];
   }

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
      orderBy: [
         search
            ? { ticketNo: 'asc' }
            : {
                 exitTime: {
                    sort: 'desc',
                    nulls:
                       dateRange?.from && dateRange?.to ? undefined : 'first'
                 }
              },
         { entryTime: 'desc' }
      ]
   };

   const [data, totalData] = await Promise.all([
      db.outgoingScale.findMany(filters),
      db.outgoingScale.count({ where })
   ]);

   return <DataTable columns={columns} data={data} totalItems={totalData} />;
}
