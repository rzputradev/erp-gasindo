'use client';

import { User } from '@prisma/client';
import { toast } from 'sonner';
import { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, MoreHorizontal, ReceiptText, Trash } from 'lucide-react';

import { deleteUser } from '@/actions/user/delete';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCheckPermissions } from '@/hooks/use-user';

interface CellActionProps {
   data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const router = useRouter();

   const updateAccess = useCheckPermissions(['user:update']);
   const deleteAccess = useCheckPermissions(['user:delete']);

   const onConfirm = async () => {
      setLoading(true);
      startTransition(() => {
         deleteUser(data.id)
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
               toast.error('Terjadi kesalahan, silakan coba lagi');
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
                     router.push(`/dashboard/user/read?id=${data.id}`)
                  }
               >
                  <ReceiptText className="size-4" /> <span>Rincian</span>
               </DropdownMenuItem>

               {updateAccess && (
                  <DropdownMenuItem
                     className="flex items-center space-x-2"
                     onClick={() =>
                        router.push(`/dashboard/user/update?id=${data.id}`)
                     }
                  >
                     <Edit className="size-4" /> <span>Perbaharui</span>
                  </DropdownMenuItem>
               )}

               {deleteAccess && (
                  <DropdownMenuItem
                     className="flex items-center space-x-2"
                     onClick={() => setOpen(true)}
                  >
                     <Trash className="size-4" /> <span>Hapus</span>
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};
