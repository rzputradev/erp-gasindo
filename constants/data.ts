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
      title: 'Beranda',
      url: '/dashboard/overview',
      icon: 'dashboard',
      isActive: false,
      shortcut: ['b', 'b'],
      items: []
   },
   {
      title: 'Pengguna',
      url: '/dashboard/user',
      icon: 'user',
      isActive: false,
      shortcut: ['p', 'p'],
      items: []
   },
   {
      title: 'Timbangan',
      url: '#',
      icon: 'scale',
      isActive: true,
      shortcut: ['t', 't'],
      items: [
         {
            title: 'Barang masuk',
            url: '/dashboard/scale-in',
            icon: 'scale',
            isActive: false,
            shortcut: ['b', 'm'],
            items: []
         },
         {
            title: 'Barang Keluar',
            url: '/dashboard/scale-in',
            icon: 'scale',
            isActive: false,
            shortcut: ['b', 'k'],
            items: []
         }
      ]
   },
   {
      title: 'Hak Akses',
      url: '#',
      icon: 'shieldCheck',
      isActive: true,
      shortcut: ['h', 'a'],
      items: [
         {
            title: 'Izin',
            url: '/dashboard/permission',
            icon: 'shieldCheck',
            shortcut: ['r', 'r'],
            isActive: true,
            items: []
         },
         {
            title: 'Role',
            url: '/dashboard/role',
            icon: 'shieldCheck',
            isActive: true,
            shortcut: ['r', 'r'],
            items: []
         }
      ]
   },
   {
      title: 'Konfigurasi',
      url: '#',
      icon: 'bold',
      isActive: false,
      shortcut: ['k', 'k'],
      items: [
         {
            title: 'Lokasi',
            url: '/dashboard/location',
            icon: 'bold',
            isActive: true,
            shortcut: ['l', 'l'],
            items: []
         },
         {
            title: 'Tipe Item',
            url: '/dashboard/item-type',
            icon: 'bold',
            isActive: true,
            shortcut: ['t', 'i'],
            items: []
         },
         {
            title: 'Item',
            url: '/dashboard/item',
            icon: 'bold',
            isActive: true,
            shortcut: ['i', 'i'],
            items: []
         },
         {
            title: 'Pembeli',
            url: '/dashboard/buyer',
            icon: 'bold',
            isActive: true,
            shortcut: ['p', 'i'],
            items: []
         },
         {
            title: 'Pemasok',
            url: '/dashboard/supplier',
            icon: 'bold',
            isActive: true,
            shortcut: ['p', 'k'],
            items: []
         },
         {
            title: 'Tipe Kendaraan',
            url: '/dashboard/vehicle-type',
            icon: 'bold',
            isActive: true,
            shortcut: ['t', 'k'],
            items: []
         },
         {
            title: 'Pengangkutan',
            url: '/dashboard/transporter',
            icon: 'bold',
            isActive: true,
            shortcut: ['p', 'n'],
            items: []
         }
      ]
   },
   {
      title: 'Kanban',
      url: '/dashboard/kanban',
      icon: 'kanban',
      shortcut: ['k', 'k'],
      isActive: false,
      items: []
   },
   {
      title: 'Pengaturan',
      url: '#',
      icon: 'settings',
      isActive: false,
      shortcut: ['p', 's'],
      items: [
         {
            title: 'Info Pribadi',
            url: '/dashboard/personal',
            icon: 'userRoundCog',
            shortcut: ['i', 'p'],
            isActive: true,
            items: []
         },
         {
            title: 'Ganti Password',
            shortcut: ['g', 'p'],
            url: '/dashboard/change-password',
            icon: 'keyRound',
            isActive: true,
            items: []
         }
      ]
   }
];
