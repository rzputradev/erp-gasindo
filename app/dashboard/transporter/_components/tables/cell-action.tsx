'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { Transporter } from '@prisma/client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { deleteItemType } from '@/actions/item-type/delete';
import { deleteVehicleType } from '@/actions/vehicle-type/delete';
import { deleteTransporter } from '@/actions/transporter/delete';

interface CellActionProps {
   data: Transporter;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const router = useRouter();

   const onConfirm = async () => {
      setLoading(true);
      startTransition(() => {
         deleteTransporter(data.id)
            .then((res) => {
               if (res?.error) {
                  toast.error(res.error);
               }
               if (res?.success) {
                  toast.success(res.success);
               }
               setLoading(false);
               setOpen(false);
            })
            .catch((e) => {
               console.log(e);
               toast.error('Something went wrong!');
            });
      });
   };

   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onConfirm}
            loading={loading}
         />
         <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuLabel>Actions</DropdownMenuLabel>

               <DropdownMenuItem
                  className="flex items-center space-x-2"
                  onClick={() =>
                     router.push(`/dashboard/transporter/update?id=${data.id}`)
                  }
               >
                  <Edit className="size-4" /> <p>Update</p>
               </DropdownMenuItem>
               <DropdownMenuItem
                  className="flex items-center space-x-2"
                  onClick={() => setOpen(true)}
               >
                  <Trash className="size-4" /> <p>Delete</p>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};
