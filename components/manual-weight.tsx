import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface ManualWeightProps {
   form: UseFormReturn<any>;
   isPending: boolean;
   weightField: string;
}

export function ManualWeight({
   form,
   isPending,
   weightField
}: ManualWeightProps) {
   return (
      <FormField
         control={form.control}
         name={weightField}
         render={({ field }) => (
            <FormItem className="md:col-span-2">
               <FormLabel>Berat (Kg) - Manual</FormLabel>
               <FormControl>
                  <Input
                     type="number"
                     disabled={isPending}
                     className="h-24 text-center text-6xl text-primary"
                     {...field}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}
