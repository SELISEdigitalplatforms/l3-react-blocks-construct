// import React from 'react';
// import { Column } from '@tanstack/react-table';
// import { CalendarIcon } from 'lucide-react';
// import { formatDate } from 'utils/custom-date';
// import { useIsMobile } from 'hooks/use-mobile';
// import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
// import { Button } from 'components/ui/button';
// import { Separator } from 'components/ui/separator';
// import usePopoverWidth from 'hooks/use-popover-width';
// import { Calendar } from 'components/ui/calendar';
// import { DateRange } from 'react-day-picker';

// interface DateRangeFilterProps<TData, TValue> {
//   column?: Column<TData, TValue>;
//   title: string;
//   date: DateRange | undefined;
//   onDateChange: (date: DateRange | undefined) => void;
// }

// export function DateRangeFilter<TData, TValue>({
//   column,
//   title,
//   date,
//   onDateChange,
// }: DateRangeFilterProps<TData, TValue>) {
//   const isMobile = useIsMobile();
//   const [buttonRef, popoverWidth] = usePopoverWidth();
//   const [open, setOpen] = React.useState(false);

//   const handleDateSelect = (selectedDateRange: DateRange | undefined) => {
//     onDateChange(selectedDateRange);
//     if (selectedDateRange?.from && selectedDateRange?.to) {
//       column?.setFilterValue(selectedDateRange);
//     } else {
//       column?.setFilterValue(undefined);
//     }
//   };

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button ref={buttonRef} variant="outline" size="sm" className="h-8 border-dashed w-full">
//           <div className="flex w-full items-center justify-between">
//             <div className="flex items-center">
//               <CalendarIcon className="mr-2 h-4 w-4" />
//               <span>{title}</span>
//             </div>
//             {date?.from && (
//               <>
//                 <Separator orientation="vertical" className="hidden h-4 sm:mx-2 sm:block" />
//                 <span className="truncate ml-2">
//                   {formatDate(date.from, true)}
//                   {date.to && (
//                     <>
//                       {' - '}
//                       {formatDate(date.to, true)}
//                     </>
//                   )}
//                 </span>
//               </>
//             )}
//           </div>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent
//         className="p-0"
//         align="start"
//         sideOffset={8}
//         style={{
//           width: isMobile ? (popoverWidth ? `${popoverWidth}px` : '100%') : 'auto',
//           maxWidth: '100vw',
//         }}
//       >
//         <Calendar
//           initialFocus
//           mode="range"
//           defaultMonth={date?.from}
//           selected={date}
//           onSelect={(newDate) => {
//             handleDateSelect(newDate);
//             if (newDate?.from && newDate?.to) {
//               setOpen(false);
//             }
//           }}
//           numberOfMonths={isMobile ? 1 : 2}
//           className="rounded-md border"
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }

import React from 'react';
import { Column } from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';
import { formatDate } from 'utils/custom-date';
import { useIsMobile } from 'hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import usePopoverWidth from 'hooks/use-popover-width';
import { Calendar } from 'components/ui/calendar';
import { DateRange } from 'react-day-picker';

interface DateRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title: string;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DateRangeFilter<TData, TValue>({
  column,
  title,
  date,
  onDateChange,
}: DateRangeFilterProps<TData, TValue>) {
  const isMobile = useIsMobile();
  const [buttonRef, popoverWidth] = usePopoverWidth();
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (selectedDateRange: DateRange | undefined) => {
    if (selectedDateRange?.from && !selectedDateRange.to) {
      const singleDayRange: DateRange = {
        from: selectedDateRange.from,
        to: selectedDateRange.from,
      };

      onDateChange(singleDayRange);

      column?.setFilterValue({
        from: singleDayRange.from,
        to: singleDayRange.to,
        type: 'date_range',
      });

      setOpen(false);

      return;
    }

    onDateChange(selectedDateRange);

    if (selectedDateRange?.from && selectedDateRange?.to) {
      column?.setFilterValue({
        from: selectedDateRange.from,
        to: selectedDateRange.to,
        type: 'date_range',
      });

      setOpen(false);
    } else if (!selectedDateRange) {
      column?.setFilterValue(undefined);
    }
  };

  const clearFilter = () => {
    onDateChange(undefined);
    column?.setFilterValue(undefined);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button ref={buttonRef} variant="outline" size="sm" className="h-8 border-dashed w-full">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{title}</span>
            </div>
            {date?.from && (
              <>
                <Separator orientation="vertical" className="hidden h-4 sm:mx-2 sm:block" />
                <span className="truncate ml-2">
                  {formatDate(date.from, true)}
                  {date.to && date.from !== date.to && (
                    <>
                      {' - '}
                      {formatDate(date.to, true)}
                    </>
                  )}
                </span>
              </>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 flex flex-col"
        align="start"
        sideOffset={8}
        style={{
          width: isMobile ? (popoverWidth ? `${popoverWidth}px` : '100%') : 'auto',
          maxWidth: '100vw',
        }}
      >
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleDateSelect}
          numberOfMonths={isMobile ? 1 : 2}
          className="rounded-md border"
        />
        <div className="p-2 border-t mt-auto">
          <Button variant="ghost" size="sm" onClick={clearFilter} className="w-full">
            Clear Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
