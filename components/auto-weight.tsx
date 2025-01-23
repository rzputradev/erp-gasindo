import { Button } from '@/components/ui/button';
import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface AutoWeightProps {
   form: UseFormReturn<any>;
   weightField: string;
}

const scaleUrl = process.env.NEXT_PUBLIC_SCALE_API as string;

export function AutoWeight({ form, weightField }: AutoWeightProps) {
   const [state, setState] = useState<
      'hold' | 'release' | 'pending' | 'connected' | 'error' | 'retry'
   >('hold');
   const [errorMessage, setErrorMessage] = useState<string | undefined>(
      undefined
   );
   const [retryCount, setRetryCount] = useState<number>(0);
   const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

   const MAX_RETRIES = 5;

   const fetchWeight = async () => {
      try {
         setState('pending');

         const response = await fetch(scaleUrl);
         if (!response.ok) {
            throw new Error('Failed to fetch weight data. Please try again.');
         }

         const jsonData = await response.json();
         const fetchedWeight = jsonData.data.weight;

         form.setValue(weightField, fetchedWeight);
         setState('connected');
         setRetryCount(0);
      } catch (error: any) {
         console.error('Error fetching weight data:', error);
         form.setValue(weightField, 0);
         setState('retry');
         setErrorMessage(error.message || 'An unexpected error occurred.');
      } finally {
      }
   };

   useEffect(() => {
      if (!scaleUrl) {
         setState('error');
         setErrorMessage('Timbangan tidak ditemukan');
         return;
      }

      if (state === 'release') {
         form.clearErrors(weightField);
         const initialDelay = setTimeout(() => {
            fetchWeight();
            const interval = setInterval(fetchWeight, 600);
            setIntervalId(interval);
         }, 1000);

         return () => {
            clearTimeout(initialDelay);
            if (intervalId) clearInterval(intervalId);
         };
      } else if (state === 'hold' || state === 'error' || state === 'retry') {
         if (intervalId) clearInterval(intervalId);
      }
   }, [state, form, weightField]);

   const handleHold = () => {
      setState('hold');
      setRetryCount(0);
   };

   const handleRelease = () => {
      if (state !== 'connected') {
         setState('release');
         setRetryCount(0);
      }
   };

   const handleRetry = () => {
      if (retryCount < MAX_RETRIES) {
         setRetryCount((prev) => prev + 1);
         fetchWeight();
      }
   };

   const getStatusMessage = () => {
      if (retryCount >= MAX_RETRIES) return 'Please contact IT support.';
      switch (state) {
         case 'pending':
            return 'Menghubungkan...';
         case 'connected':
            return 'Terhubung';
         case 'error':
         case 'retry':
            return errorMessage || 'Silahkan coba lagi';
         case 'hold':
            return 'Timbangan ditahan';
         case 'release':
            return 'Timbangan dilepas...';
         default:
            return '';
      }
   };

   return (
      <div className="space-y-2 md:col-span-2">
         <FormField
            control={form.control}
            name={weightField}
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Weight (Kg)</FormLabel>
                  <FormControl>
                     <Input
                        type="number"
                        disabled
                        className="h-24 text-center text-6xl text-primary"
                        {...field}
                     />
                  </FormControl>
                  <FormMessage />
                  <div className="flex flex-wrap justify-between">
                     <FormDescription
                        className={
                           state === 'error' || state === 'retry'
                              ? 'text-destructive'
                              : ''
                        }
                     >
                        {getStatusMessage()}
                     </FormDescription>

                     <div className="flex space-x-2">
                        {state === 'retry' || retryCount >= MAX_RETRIES ? (
                           <Button
                              onClick={handleRetry}
                              disabled={retryCount >= MAX_RETRIES}
                              size="sm"
                              variant="default"
                           >
                              {retryCount >= MAX_RETRIES
                                 ? 'Retry Disabled'
                                 : 'Retry'}
                           </Button>
                        ) : (
                           <>
                              <Button
                                 role="button"
                                 onClick={handleRelease}
                                 disabled={
                                    state === 'release' ||
                                    state === 'pending' ||
                                    state === 'connected'
                                 }
                                 size="sm"
                                 variant="default"
                                 className="h-6"
                              >
                                 Lepaskan
                              </Button>
                              <Button
                                 onClick={handleHold}
                                 disabled={state === 'hold'}
                                 size="sm"
                                 variant="destructive"
                                 className="h-6"
                              >
                                 Tahan
                              </Button>
                           </>
                        )}
                     </div>
                  </div>
               </FormItem>
            )}
         />
      </div>
   );
}
