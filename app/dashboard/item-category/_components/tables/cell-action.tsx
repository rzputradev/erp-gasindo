'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { Edit, MoreHorizontal, ReceiptText, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { ItemCategory } from '@prisma/client';

import { deleteItemCategory } from '@/actions/item-category/delete';
import { useCheckPermissions } from '@/hooks/use-user';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface CellActionProps {
   data: ItemCategory;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const router = useRouter();

   const updateAccess = useCheckPermissions(['item-type:update']);
   const deleteAccess = useCheckPermissions(['item-type:delete']);

   const onConfirm = async () => {
      setLoading(true);
      startTransition(() => {
         deleteItemCategory(data.id)
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
                     router.push(`/dashboard/item-type/read?id=${data.id}`)
                  }
               >
                  <ReceiptText className="size-4" /> <p>Rincian</p>
               </DropdownMenuItem>

               {updateAccess && (
                  <DropdownMenuItem
                     className="flex items-center space-x-2"
                     onClick={() =>
                        router.push(`/dashboard/item-type/update?id=${data.id}`)
                     }
                  >
                     <Edit className="size-4" /> <p>Perbaharui</p>
                  </DropdownMenuItem>
               )}

               {deleteAccess && (
                  <DropdownMenuItem
                     className="flex items-center space-x-2"
                     onClick={() => setOpen(true)}
                  >
                     <Trash className="size-4" /> <p>Hapus</p>
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};
