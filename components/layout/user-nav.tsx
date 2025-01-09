'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
export function UserNav() {
   const router = useRouter();
   const { data: session } = useSession();
   if (session) {
      return (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
               >
                  <Avatar className="h-8 w-8">
                     <AvatarImage
                        src={`/api/images${session.user?.image ?? ''}`}
                        alt={session.user?.name ?? ''}
                     />
                     <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
               <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                     <p className="text-sm font-medium leading-none">
                        {session.user?.name}
                     </p>
                     <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                     </p>
                  </div>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                     Beranda
                     <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() => router.push('/dashboard/personal')}
                  >
                     Info Pribadi
                     <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() => router.push('/dashboard/change-password')}
                  >
                     Ganti Password
                     <DropdownMenuShortcut>⌘G</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() => router.push('/dashboard/kanban')}
                  >
                     Papan Catatan
                     <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                  </DropdownMenuItem>
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                  Keluar
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      );
   }
}
