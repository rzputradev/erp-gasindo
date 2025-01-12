'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
   title: string;
   link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
   '/dashboard': [{ title: 'Beranda', link: '/dashboard' }],
   '/dashboard/overview': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Ikhtisar', link: '/dashboard/overview' }
   ],

   // User
   '/dashboard/user': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pengguna', link: '/dashboard/user' }
   ],
   '/dashboard/user/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pengguna', link: '/dashboard/user' },
      { title: 'Tambah', link: '/dashboard/user/create' }
   ],
   '/dashboard/user/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pengguna', link: '/dashboard/user' },
      { title: 'Perbaharui', link: '/dashboard/user/update' }
   ],

   // Permission
   '/dashboard/permission': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Izin', link: '/dashboard/permission' }
   ],
   '/dashboard/permission/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Izin', link: '/dashboard/permission' },
      { title: 'Tambah', link: '/dashboard/permission/create' }
   ],
   '/dashboard/permission/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Izin', link: '/dashboard/permission' },
      { title: 'Perbaharui', link: '/dashboard/permission/update' }
   ],

   // Permission
   '/dashboard/role': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Peran', link: '/dashboard/role' }
   ],
   '/dashboard/role/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Peran', link: '/dashboard/role' },
      { title: 'Tambah', link: '/dashboard/role/create' }
   ],
   '/dashboard/role/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Peran', link: '/dashboard/role' },
      { title: 'Perbaharui', link: '/dashboard/role/update' }
   ],

   // Location
   '/dashboard/location': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Lokasi', link: '/dashboard/location' }
   ],
   '/dashboard/location/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Lokasi', link: '/dashboard/location' },
      { title: 'Tambah', link: '/dashboard/location/create' }
   ],
   '/dashboard/location/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Lokasi', link: '/dashboard/location' },
      { title: 'Perbaharui', link: '/dashboard/location/update' }
   ],

   // Item Type
   '/dashboard/item-type': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Tipe Item', link: '/dashboard/item-type' }
   ],
   '/dashboard/item-type/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Tipe Item', link: '/dashboard/item-type' },
      { title: 'Tambah', link: '/dashboard/item-type/create' }
   ],
   '/dashboard/item-type/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Tipe Item', link: '/dashboard/item-type' },
      { title: 'Perbaharui', link: '/dashboard/item-type/update' }
   ],

   // Item
   '/dashboard/item': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Item', link: '/dashboard/item' }
   ],
   '/dashboard/item/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Item', link: '/dashboard/item' },
      { title: 'Tambah', link: '/dashboard/item/create' }
   ],
   '/dashboard/item/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Item', link: '/dashboard/item' },
      { title: 'Perbaharui', link: '/dashboard/item/update' }
   ],

   // Buyer
   '/dashboard/buyer': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pembeli', link: '/dashboard/buyer' }
   ],
   '/dashboard/buyer/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pembeli', link: '/dashboard/buyer' },
      { title: 'Tambah', link: '/dashboard/buyer/create' }
   ],
   '/dashboard/buyer/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pembeli', link: '/dashboard/buyer' },
      { title: 'Perbaharui', link: '/dashboard/buyer/update' }
   ],

   // Supplier
   '/dashboard/supplier': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pemasok', link: '/dashboard/supplier' }
   ],
   '/dashboard/supplier/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pemasok', link: '/dashboard/supplier' },
      { title: 'Tambah', link: '/dashboard/supplier/create' }
   ],
   '/dashboard/supplier/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pemasok', link: '/dashboard/supplier' },
      { title: 'Perbaharui', link: '/dashboard/supplier/update' }
   ],

   // Vehicle Type
   '/dashboard/vehicle-type': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Tipe Kendaraan', link: '/dashboard/vehicle-type' }
   ],
   '/dashboard/vehicle-type/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Tipe Kendaraan', link: '/dashboard/vehicle-type' },
      { title: 'Tambah', link: '/dashboard/vehicle-type/create' }
   ],
   '/dashboard/vehicle-type/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Tipe Kendaraan', link: '/dashboard/vehicle-type' },
      { title: 'Perbaharui', link: '/dashboard/vehicle-type/update' }
   ],

   // Transporter
   '/dashboard/transporter': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pengangkutan', link: '/dashboard/transporter' }
   ],
   '/dashboard/transporter/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pengangkutan', link: '/dashboard/transporter' },
      { title: 'Tambah', link: '/dashboard/transporter/create' }
   ],
   '/dashboard/transporter/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pengangkutan', link: '/dashboard/transporter' },
      { title: 'Perbaharui', link: '/dashboard/transporter/update' }
   ],

   // Setting
   '/dashboard/personal': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Info Pribadi', link: '/dashboard/transporter' }
   ],
   '/dashboard/change-password': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Ganti Password', link: '/dashboard/change-password' }
   ]
};

export function useBreadcrumbs() {
   const pathname = usePathname();

   const breadcrumbs = useMemo(() => {
      // Check if we have a custom mapping for this exact path
      if (routeMapping[pathname]) {
         return routeMapping[pathname];
      }

      // If no exact match, fall back to generating breadcrumbs from the path
      const segments = pathname.split('/').filter(Boolean);
      return segments.map((segment, index) => {
         const path = `/${segments.slice(0, index + 1).join('/')}`;
         return {
            title: segment.charAt(0).toUpperCase() + segment.slice(1),
            link: path
         };
      });
   }, [pathname]);

   return breadcrumbs;
}
