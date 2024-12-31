'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Gender, User } from '@prisma/client';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'Nama'
  },
  {
    accessorKey: 'gender',
    header: 'Jenis Kelamin',
    cell: ({ row }) => {
      const gender = row.original.gender;
      return gender === Gender.FEMALE ? 'Perempuan' : gender === Gender.MALE ? 'Laki-laki' : 'Lain-lain';
    }
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'role.location.name',
    header: 'Lokasi'
  },
  {
    accessorKey: 'role.name',
    header: 'Role'
  },
  {
    id: 'actions',
    // header: 'ACTION',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
