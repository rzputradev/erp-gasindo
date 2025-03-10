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
   '/dashboard/user/read': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pengguna', link: '/dashboard/user' },
      { title: 'Rincian', link: '/dashboard/user/read' }
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
   '/dashboard/permission/read': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Izin', link: '/dashboard/permission' },
      { title: 'Rincian', link: '/dashboard/permission/read' }
   ],

   // Role
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
   '/dashboard/role/read': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Peran', link: '/dashboard/role' },
      { title: 'Rincian', link: '/dashboard/role/read' }
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
   '/dashboard/location/read': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Lokasi', link: '/dashboard/location' },
      { title: 'Rincian', link: '/dashboard/location/read' }
   ],

   // Item Type
   '/dashboard/category': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Kategori Barang', link: '/dashboard/category' }
   ],
   '/dashboard/category/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Kategori Barang', link: '/dashboard/category' },
      { title: 'Tambah', link: '/dashboard/category/create' }
   ],
   '/dashboard/category/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Kategori Barang', link: '/dashboard/category' },
      { title: 'Perbaharui', link: '/dashboard/category/update' }
   ],
   '/dashboard/category/read': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Kategori Barang', link: '/dashboard/category' },
      { title: 'Rincian', link: '/dashboard/category/read' }
   ],

   // Item
   '/dashboard/item': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang', link: '/dashboard/item' }
   ],
   '/dashboard/item/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang', link: '/dashboard/item' },
      { title: 'Tambah', link: '/dashboard/item/create' }
   ],
   '/dashboard/item/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang', link: '/dashboard/item' },
      { title: 'Perbaharui', link: '/dashboard/item/update' }
   ],
   '/dashboard/item/read': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang', link: '/dashboard/item' },
      { title: 'Rincian', link: '/dashboard/item/read' }
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
   '/dashboard/buyer/read': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pembeli', link: '/dashboard/buyer' },
      { title: 'Rincian', link: '/dashboard/buyer/read' }
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
   '/dashboard/supplier/read': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pemasok', link: '/dashboard/supplier' },
      { title: 'Rincian', link: '/dashboard/supplier/read' }
   ],

   // Contract
   '/dashboard/contract': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Kontrak', link: '/dashboard/contract' }
   ],
   '/dashboard/contract/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Kontrak', link: '/dashboard/contract' },
      { title: 'Tambah', link: '/dashboard/contract/create' }
   ],
   '/dashboard/contract/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Kontrak', link: '/dashboard/contract' },
      { title: 'Perbaharui', link: '/dashboard/contract/update' }
   ],
   '/dashboard/contract/read': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Kontrak', link: '/dashboard/contract' },
      { title: 'Rincian', link: '/dashboard/contract/read' }
   ],

   // Order
   '/dashboard/order': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pengambilan', link: '/dashboard/order' }
   ],
   '/dashboard/order/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pengambilan', link: '/dashboard/order' },
      { title: 'Tambah', link: '/dashboard/order/create' }
   ],
   '/dashboard/order/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pengambilan', link: '/dashboard/order' },
      { title: 'Perbaharui', link: '/dashboard/order/update' }
   ],
   '/dashboard/order/read': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Pengambilan', link: '/dashboard/order' },
      { title: 'Rincian', link: '/dashboard/order/read' }
   ],

   // Outgoing
   '/dashboard/outgoing': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang Keluar', link: '/dashboard/outgoing' }
   ],
   '/dashboard/outgoing/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang Keluar', link: '/dashboard/outgoing' },
      { title: 'Timbang Masuk', link: '/dashboard/outgoing/create' }
   ],
   '/dashboard/outgoing/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang Keluar', link: '/dashboard/outgoing' },
      { title: 'Perbaharui', link: '/dashboard/outgoing/update' }
   ],
   '/dashboard/outgoing/read': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang Keluar', link: '/dashboard/outgoing' },
      { title: 'Rincian', link: '/dashboard/outgoing/read' }
   ],
   '/dashboard/outgoing/exit': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang Keluar', link: '/dashboard/outgoing' },
      { title: 'Timbang Keluar', link: '/dashboard/outgoing/exit' }
   ],

   // Incoming
   '/dashboard/incoming': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang Masuk', link: '/dashboard/incoming' }
   ],
   '/dashboard/incoming/create': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang Masuk', link: '/dashboard/incoming' },
      { title: 'Timbang Masuk', link: '/dashboard/incoming/create' }
   ],
   '/dashboard/incoming/update': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang Masuk', link: '/dashboard/incoming' },
      { title: 'Perbaharui', link: '/dashboard/incoming/update' }
   ],
   '/dashboard/incoming/read': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang Masuk', link: '/dashboard/incoming' },
      { title: 'Rincian', link: '/dashboard/incoming/read' }
   ],
   '/dashboard/incoming/exit': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Barang Masuk', link: '/dashboard/incoming' },
      { title: 'Timbang Masuk', link: '/dashboard/incoming/exit' }
   ],

   // Setting
   '/dashboard/personal': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Info Pribadi', link: '/dashboard/transporter' }
   ],
   '/dashboard/password': [
      { title: 'Beranda', link: '/dashboard' },
      { title: 'Ganti Password', link: '/dashboard/password' }
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
