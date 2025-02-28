import { db } from '@/lib/db';

interface generateTicketNoProps {
   locationId: string;
}

export async function generateTicketNo({ locationId }: generateTicketNoProps) {
   const currentYear = new Date().getFullYear();

   const location = await db.location.findUnique({ where: { id: locationId } });

   if (!location) return null;

   const outgoingCount = await db.outgoingScale.count({
      where: {
         order: {
            contract: {
               locationId
            }
         },
         createdAt: {
            gte: new Date(`${currentYear}-01-01T00:00:00Z`),
            lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`)
         }
      }
   });

   const nextTicketNo = outgoingCount + 1;

   return `OUT.${nextTicketNo}.${location.key}.${currentYear}`;
}
