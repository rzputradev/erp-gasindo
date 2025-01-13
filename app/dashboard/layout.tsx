import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { currentUser } from '@/data/user';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
   title: 'Garuda Sakti',
   description: 'ERP'
};

export default async function DashboardLayout({
   children
}: {
   children: React.ReactNode;
}) {
   // Persisting the sidebar state in the cookie.
   const cookieStore = await cookies();
   const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
   const user = await currentUser();

   if (!user) return redirect('/');

   return (
      <KBar>
         <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar user={user} />
            <SidebarInset>
               <Header />
               {/* page main content */}
               {children}
               {/* page main content ends */}
            </SidebarInset>
         </SidebarProvider>
      </KBar>
   );
}
