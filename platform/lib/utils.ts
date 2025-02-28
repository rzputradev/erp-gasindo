import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Active, DataRef, Over } from '@dnd-kit/core';
import { ColumnDragData } from '@/app/dashboard/kanban/_components/board-column';
import { TaskDragData } from '@/app/dashboard/kanban/_components/task-card';
import { format } from 'date-fns';

type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
   entry: T | null | undefined
): entry is T & {
   data: DataRef<DraggableData>;
} {
   if (!entry) {
      return false;
   }

   const data = entry.data.current;

   if (data?.type === 'Column' || data?.type === 'Task') {
      return true;
   }

   return false;
}

export function formatBytes(
   bytes: number,
   opts: {
      decimals?: number;
      sizeType?: 'accurate' | 'normal';
   } = {}
) {
   const { decimals = 0, sizeType = 'normal' } = opts;

   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
   if (bytes === 0) return '0 Byte';
   const i = Math.floor(Math.log(bytes) / Math.log(1024));
   return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
      sizeType === 'accurate'
         ? (accurateSizes[i] ?? 'Bytest')
         : (sizes[i] ?? 'Bytes')
   }`;
}

export const monthToRoman: { [key: number]: string } = {
   0: 'I',
   1: 'II',
   2: 'III',
   3: 'IV',
   4: 'V',
   5: 'VI',
   6: 'VII',
   7: 'VIII',
   8: 'IX',
   9: 'X',
   10: 'XI',
   11: 'XII'
};

export function formatNumber(number: number) {
   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatDate(date: Date) {
   return date ? format(new Date(date), 'M/d/yyyy, h:mm a') : 'N/A';
}
