'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
   title: string;
   link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
   '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],

   // User
   '/dashboard/user': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Pengguna', link: '/dashboard/user' }
   ],
   '/dashboard/user/create': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Pengguna', link: '/dashboard/user' },
      { title: 'Tambah', link: '/dashboard/user/create' }
   ],
   '/dashboard/user/update': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Pengguna', link: '/dashboard/user' },
      { title: 'Perbaharui', link: '/dashboard/user/update' }
   ],

   // Permission
   '/dashboard/permission': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Izin', link: '/dashboard/permission' }
   ],
   '/dashboard/permission/create': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Izin', link: '/dashboard/permission' },
      { title: 'Tambah', link: '/dashboard/permission/create' }
   ],
   '/dashboard/permission/update': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Izin', link: '/dashboard/permission' },
      { title: 'Perbaharui', link: '/dashboard/permission/update' }
   ],

   // Permission
   '/dashboard/role': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Role', link: '/dashboard/role' }
   ],
   '/dashboard/role/create': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Role', link: '/dashboard/role' },
      { title: 'Tambah', link: '/dashboard/role/create' }
   ],
   '/dashboard/role/update': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Role', link: '/dashboard/role' },
      { title: 'Perbaharui', link: '/dashboard/role/update' }
   ],

   // Location
   '/dashboard/location': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Lokasi', link: '/dashboard/location' }
   ],
   '/dashboard/location/create': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Lokasi', link: '/dashboard/location' },
      { title: 'Tambah', link: '/dashboard/location/create' }
   ],
   '/dashboard/location/update': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Lokasi', link: '/dashboard/location' },
      { title: 'Perbaharui', link: '/dashboard/location/update' }
   ],

   // Item Type
   '/dashboard/item-type': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Tipe Item', link: '/dashboard/item-type' }
   ],
   '/dashboard/item-type/create': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Tipe Item', link: '/dashboard/item-type' },
      { title: 'Tambah', link: '/dashboard/item-type/create' }
   ],
   '/dashboard/item-type/update': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Tipe Item', link: '/dashboard/item-type' },
      { title: 'Perbaharui', link: '/dashboard/item-type/update' }
   ],

   // Item
   '/dashboard/item': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Item', link: '/dashboard/item' }
   ],
   '/dashboard/item/create': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Item', link: '/dashboard/item' },
      { title: 'Tambah', link: '/dashboard/item/create' }
   ],
   '/dashboard/item/update': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Item', link: '/dashboard/item' },
      { title: 'Perbaharui', link: '/dashboard/item/update' }
   ],

   // Buyer
   '/dashboard/buyer': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Pembeli', link: '/dashboard/buyer' }
   ],
   '/dashboard/buyer/create': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Pembeli', link: '/dashboard/buyer' },
      { title: 'Tambah', link: '/dashboard/buyer/create' }
   ],
   '/dashboard/buyer/update': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Pembeli', link: '/dashboard/buyer' },
      { title: 'Perbaharui', link: '/dashboard/buyer/update' }
   ],

   // Supplier
   '/dashboard/supplier': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Pemasok', link: '/dashboard/supplier' }
   ],
   '/dashboard/supplier/create': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Pemasok', link: '/dashboard/supplier' },
      { title: 'Tambah', link: '/dashboard/supplier/create' }
   ],
   '/dashboard/supplier/update': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Pemasok', link: '/dashboard/supplier' },
      { title: 'Perbaharui', link: '/dashboard/supplier/update' }
   ],

   // Vehicle Type
   '/dashboard/vehicle-type': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Tipe Kendaraan', link: '/dashboard/vehicle-type' }
   ],
   '/dashboard/vehicle-type/create': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Tipe Kendaraan', link: '/dashboard/vehicle-type' },
      { title: 'Tambah', link: '/dashboard/vehicle-type/create' }
   ],
   '/dashboard/vehicle-type/update': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Tipe Kendaraan', link: '/dashboard/vehicle-type' },
      { title: 'Perbaharui', link: '/dashboard/vehicle-type/update' }
   ],

   // Transporter
   '/dashboard/transporter': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Pengangkutan', link: '/dashboard/transporter' }
   ],
   '/dashboard/transporter/create': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Pengangkutan', link: '/dashboard/transporter' },
      { title: 'Tambah', link: '/dashboard/transporter/create' }
   ],
   '/dashboard/transporter/update': [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Pengangkutan', link: '/dashboard/transporter' },
      { title: 'Perbaharui', link: '/dashboard/transporter/update' }
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
