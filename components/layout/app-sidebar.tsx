'use client';

import * as React from 'react';
import { navItems } from '@/constants/data';
import { ChevronRight, ChevronsUpDown, GalleryVerticalEnd } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NavItem } from '@/types';
import { User } from 'next-auth';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger
} from '@/components/ui/collapsible';
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
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
   SidebarRail
} from '@/components/ui/sidebar';
import { Icons } from '../icons';
import { Logo } from '../logo';

export const company = {
   name: 'PT Garuda Sakti',
   logo: GalleryVerticalEnd,
   plan: 'Nusantara Indonesia'
};

export default function AppSidebar({ user }: { user: User }) {
   const pathname = usePathname();
   const router = useRouter();

   return (
      <Sidebar collapsible="icon">
         <SidebarHeader>
            <div className="flex gap-2 py-2 text-sidebar-accent-foreground">
               <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-foreground/80 text-sidebar-primary-foreground dark:bg-secondary-foreground/90">
                  <Logo url="/dashboard" short={true} height={20} width={20} />
               </div>
               <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{company.name}</span>
                  <span className="truncate text-xs">{company.plan}</span>
               </div>
            </div>
         </SidebarHeader>
         <SidebarContent className="overflow-x-hidden">
            <SidebarGroup>
               <SidebarGroupLabel>Applikasi</SidebarGroupLabel>
               <SidebarMenu>
                  {navItems.map((item: NavItem) => {
                     const Icon = item.icon ? Icons[item.icon] : Icons.logo;

                     const hasPermission = (permission: string | undefined) =>
                        permission == null ||
                        user?.permissions?.includes(permission);

                     // Handle items with subitems
                     if (item.items && item.items.length > 0) {
                        // Filter subitems based on permissions
                        const filteredSubItems = item.items.filter((subItem) =>
                           hasPermission(subItem.permission)
                        );

                        // Show parent only if there are subitems with valid permissions
                        if (filteredSubItems.length > 0) {
                           return (
                              <Collapsible
                                 key={item.title}
                                 asChild
                                 defaultOpen={item.isActive}
                                 className="group/collapsible"
                              >
                                 {hasPermission(item.permission) && (
                                    <SidebarMenuItem>
                                       <div>
                                          <CollapsibleTrigger asChild>
                                             <SidebarMenuButton
                                                tooltip={item.title}
                                                isActive={pathname === item.url}
                                             >
                                                {item.icon && <Icon />}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                             </SidebarMenuButton>
                                          </CollapsibleTrigger>
                                          <CollapsibleContent>
                                             {filteredSubItems.map(
                                                (subItem) => {
                                                   const SubIcon = subItem.icon
                                                      ? Icons[subItem.icon]
                                                      : Icons.logo;
                                                   return (
                                                      <SidebarMenuSub
                                                         key={subItem.title}
                                                      >
                                                         <SidebarMenuSubItem>
                                                            <SidebarMenuSubButton
                                                               asChild
                                                               isActive={
                                                                  pathname ===
                                                                  subItem.url
                                                               }
                                                            >
                                                               <Link
                                                                  href={
                                                                     subItem.url
                                                                  }
                                                               >
                                                                  {subItem.icon && (
                                                                     <SubIcon />
                                                                  )}
                                                                  <span>
                                                                     {
                                                                        subItem.title
                                                                     }
                                                                  </span>
                                                               </Link>
                                                            </SidebarMenuSubButton>
                                                         </SidebarMenuSubItem>
                                                      </SidebarMenuSub>
                                                   );
                                                }
                                             )}
                                          </CollapsibleContent>
                                       </div>
                                    </SidebarMenuItem>
                                 )}
                              </Collapsible>
                           );
                        }
                        return null; // Don't show the parent if no subitems have permissions
                     }

                     // Render items without subitems based on their own permissions
                     return (
                        hasPermission(item.permission) && (
                           <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton
                                 asChild
                                 tooltip={item.title}
                                 isActive={pathname === item.url}
                              >
                                 <Link href={item.url}>
                                    <Icon />
                                    <span>{item.title}</span>
                                 </Link>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        )
                     );
                  })}
               </SidebarMenu>
            </SidebarGroup>
         </SidebarContent>
         <SidebarFooter>
            <SidebarMenu>
               <SidebarMenuItem>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                           size="lg"
                           className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                           <Avatar className="h-8 w-8 rounded-lg">
                              <AvatarImage
                                 src={user?.image || ''}
                                 alt={user?.name || ''}
                              />
                              <AvatarFallback className="rounded-lg">
                                 {user?.name?.slice(0, 2)?.toUpperCase() ||
                                    'CN'}
                              </AvatarFallback>
                           </Avatar>
                           <div className="grid flex-1 text-left text-sm leading-tight">
                              <span className="truncate font-semibold">
                                 {user?.name || ''}
                              </span>
                              <span className="truncate text-xs">
                                 {user?.email || ''}
                              </span>
                           </div>
                           <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                     >
                        <DropdownMenuLabel className="p-0 font-normal">
                           <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                              <Avatar className="h-8 w-8 rounded-lg">
                                 <AvatarImage
                                    src={
                                       user.image
                                          ? `/api/images${user.image}`
                                          : undefined
                                    }
                                    alt={user?.name || ''}
                                 />
                                 <AvatarFallback className="rounded-lg">
                                    {user?.name?.slice(0, 2)?.toUpperCase() ||
                                       'CN'}
                                 </AvatarFallback>
                              </Avatar>
                              <div className="grid flex-1 text-left text-sm leading-tight">
                                 <span className="truncate font-semibold">
                                    {user?.name || ''}
                                 </span>
                                 <span className="truncate text-xs">
                                    {' '}
                                    {user?.email || ''}
                                 </span>
                              </div>
                           </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                           <DropdownMenuItem
                              onClick={() => router.push('/dashboard')}
                           >
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
                              onClick={() =>
                                 router.push('/dashboard/change-password')
                              }
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
                        <DropdownMenuItem
                           onClick={() => signOut({ callbackUrl: '/' })}
                        >
                           Log out
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarFooter>
         <SidebarRail />
      </Sidebar>
   );
}
