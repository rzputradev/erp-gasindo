'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
   Popover,
   PopoverContent,
   PopoverTrigger
} from '@/components/ui/popover';

interface DataTableFilterDateRangeProps {
   dateRange: any;
   setDateRange: any;
   setPage: (value: number) => void;
   className?: string;
   defaultText?: string;
}

export function DataTableFilterDateRange({
   dateRange,
   setDateRange,
   setPage,
   className,
   defaultText = 'Pilih Tanggal'
}: DataTableFilterDateRangeProps) {
   const handleDateChange = React.useCallback(
      (value: DateRange | undefined) => {
         setDateRange(value ?? null);
         setPage(1);
      },
      [setDateRange, setPage]
   );

   const formattedRange = React.useMemo(() => {
      if (!dateRange?.from) return defaultText;
      if (!dateRange.to) return format(dateRange.from, 'LLL dd, y');
      return `${format(dateRange.from, 'LLL dd, y')} - ${format(
         dateRange.to,
         'LLL dd, y'
      )}`;
   }, [dateRange, defaultText]);

   return (
      <div className={cn('grid gap-2', className)}>
         <Popover>
            <PopoverTrigger asChild>
               <Button
                  id="date"
                  variant="outline"
                  className={cn(
                     'w-fit justify-start border-dashed text-left font-normal',
                     !dateRange && 'text-muted-foreground'
                  )}
               >
                  <CalendarIcon className="mr-2" />
                  {formattedRange}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from || new Date()}
                  selected={dateRange}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                  disabled={{
                     after: new Date()
                  }}
               />
            </PopoverContent>
         </Popover>
      </div>
   );
}
