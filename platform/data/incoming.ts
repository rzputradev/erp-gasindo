import { db } from '@/lib/db';

interface generateTicketNoProps {
   locationId: string;
}

export async function generateTicketNo({ locationId }: generateTicketNoProps) {
   const currentYear = new Date().getFullYear();

   const location = await db.location.findUnique({ where: { id: locationId } });

   if (!location) return null;

   const incomingCount = await db.incomingScale.count({
      where: {
         item: { locationId },
         createdAt: {
            gte: new Date(`${currentYear}-01-01T00:00:00Z`),
            lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`)
         }
      }
   });

   const nextTicketNo = incomingCount + 1;

   return `IN.${nextTicketNo}.${location.key}.${currentYear}`;
}
