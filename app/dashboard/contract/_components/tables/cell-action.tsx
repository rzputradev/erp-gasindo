'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { Edit, MoreHorizontal, ReceiptText, Trash, View } from 'lucide-react';
import { toast } from 'sonner';
import { Contract } from '@prisma/client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCheckPermissions, useCurrentUser } from '@/hooks/use-user';
import { deleteContract } from '@/actions/contract/delete';

interface CellActionProps {
   data: Contract;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
   const user = useCurrentUser();
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const router = useRouter();

   const updateAccess = useCheckPermissions(user, ['contract:update']);
   const deleteAccess = useCheckPermissions(user, ['contract:delete']);

   const onConfirm = async () => {
      setLoading(true);
      startTransition(() => {
         deleteContract(data.id)
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
               <DropdownMenuLabel>Aksi</DropdownMenuLabel>

               <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() =>
                     router.push(`/dashboard/contract/read?id=${data.id}`)
                  }
                  disabled={loading}
               >
                  <ReceiptText className="size-4" /> <p>Rincian</p>
               </DropdownMenuItem>

               {updateAccess && (
                  <DropdownMenuItem
                     className="flex cursor-pointer items-center gap-2"
                     onClick={() =>
                        router.push(`/dashboard/contract/update?id=${data.id}`)
                     }
                     disabled={loading}
                  >
                     <Edit className="size-4" /> <p>Perbaharui</p>
                  </DropdownMenuItem>
               )}

               {deleteAccess && (
                  <DropdownMenuItem
                     className="flex cursor-pointer items-center gap-2"
                     onClick={() => setOpen(true)}
                     disabled={loading}
                  >
                     <Trash className="size-4" /> <p>Hapus</p>
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};
