import { NavItem } from '@/types';

export type User = {
   id: number;
   name: string;
   company: string;
   role: string;
   verified: boolean;
   status: string;
};
export const users: User[] = [
   {
      id: 1,
      name: 'Candice Schiner',
      company: 'Dell',
      role: 'Frontend Developer',
      verified: false,
      status: 'Active'
   },
   {
      id: 2,
      name: 'John Doe',
      company: 'TechCorp',
      role: 'Backend Developer',
      verified: true,
      status: 'Active'
   },
   {
      id: 3,
      name: 'Alice Johnson',
      company: 'WebTech',
      role: 'UI Designer',
      verified: true,
      status: 'Active'
   },
   {
      id: 4,
      name: 'David Smith',
      company: 'Innovate Inc.',
      role: 'Fullstack Developer',
      verified: false,
      status: 'Inactive'
   },
   {
      id: 5,
      name: 'Emma Wilson',
      company: 'TechGuru',
      role: 'Product Manager',
      verified: true,
      status: 'Active'
   },
   {
      id: 6,
      name: 'James Brown',
      company: 'CodeGenius',
      role: 'QA Engineer',
      verified: false,
      status: 'Active'
   },
   {
      id: 7,
      name: 'Laura White',
      company: 'SoftWorks',
      role: 'UX Designer',
      verified: true,
      status: 'Active'
   },
   {
      id: 8,
      name: 'Michael Lee',
      company: 'DevCraft',
      role: 'DevOps Engineer',
      verified: false,
      status: 'Active'
   },
   {
      id: 9,
      name: 'Olivia Green',
      company: 'WebSolutions',
      role: 'Frontend Developer',
      verified: true,
      status: 'Active'
   },
   {
      id: 10,
      name: 'Robert Taylor',
      company: 'DataTech',
      role: 'Data Analyst',
      verified: false,
      status: 'Active'
   }
];

export type Employee = {
   id: number;
   first_name: string;
   last_name: string;
   email: string;
   phone: string;
   gender: string;
   date_of_birth: string; // Consider using a proper date type if possible
   street: string;
   city: string;
   state: string;
   country: string;
   zipcode: string;
   longitude?: number; // Optional field
   latitude?: number; // Optional field
   job: string;
   profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
   photo_url: string;
   name: string;
   description: string;
   created_at: string;
   price: number;
   id: number;
   category: string;
   updated_at: string;
};

export const navItems: NavItem[] = [
   {
      title: 'Dashboard',
      url: '/dashboard/overview',
      icon: 'dashboard',
      isActive: false,
      shortcut: ['d', 'd'],
      items: [] // Empty array as there are no child items for Dashboard
   },
   {
      title: 'Pengguna',
      url: '/dashboard/user',
      shortcut: ['u', 'u'],
      icon: 'user'
   },
   {
      title: 'Timbangan',
      url: '/dashboard/scale',
      icon: 'scale',
      shortcut: ['s', 's'],
      isActive: false,
      items: [
         {
            title: 'Barang masuk',
            url: '/dashboard/scale-in',
            icon: 'scale',
            shortcut: ['s', 's']
         },
         {
            title: 'Barang Keluar',
            url: '/dashboard/scale-in',
            icon: 'scale',
            shortcut: ['s', 's']
         }
      ]
   },
   {
      title: 'Hak Akses',
      url: '#', // Placeholder as there is no direct link for the parent
      icon: 'shieldCheck',
      isActive: true,
      items: [
         {
            title: 'Izin',
            shortcut: ['r', 'r'],
            url: '/dashboard/permission'
            // icon: 'login'
         },
         {
            title: 'Role',
            shortcut: ['r', 'r'],
            url: '/dashboard/role'
            // icon: 'login'
         }
      ]
   },
   {
      title: 'Konfigurasi',
      url: '#', // Placeholder as there is no direct link for the parent
      icon: 'bold',
      isActive: false,
      items: [
         {
            title: 'Lokasi',
            shortcut: ['l', 'l'],
            url: '/dashboard/location'
            // icon: 'login'
         },
         {
            title: 'Tipe Item',
            shortcut: ['t', 'i'],
            url: '/dashboard/item-type'
            // icon: 'login'
         },
         {
            title: 'Item',
            shortcut: ['i', 'i'],
            url: '/dashboard/item'
            // icon: 'login'
         },
         {
            title: 'Pembeli',
            shortcut: ['p', 'i'],
            url: '/dashboard/buyer'
            // icon: 'login'
         },
         {
            title: 'Pemasok',
            shortcut: ['p', 'k'],
            url: '/dashboard/supplier'
            // icon: 'login'
         },
         {
            title: 'Tipe Kendaraan',
            shortcut: ['t', 'p'],
            url: '/dashboard/vehicle-type'
            // icon: 'login'
         },
         {
            title: 'Pengangkutan',
            shortcut: ['p', 'p'],
            url: '/dashboard/transporter'
            // icon: 'login'
         }
      ]
   },
   {
      title: 'Account',
      url: '#', // Placeholder as there is no direct link for the parent
      icon: 'billing',
      isActive: false,
      items: [
         {
            title: 'Profile',
            url: '/dashboard/profile',
            icon: 'userPen',
            shortcut: ['m', 'm']
         },
         {
            title: 'Ganti Password',
            shortcut: ['l', 'l'],
            url: '/',
            icon: 'login'
         }
      ]
   }
   // {
   //   title: 'Kanban',
   //   url: '/dashboard/kanban',
   //   icon: 'kanban',
   //   shortcut: ['k', 'k'],
   //   isActive: false,
   //   items: [] // No child items
   // }
];
