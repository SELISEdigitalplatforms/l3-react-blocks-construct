import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui-kit/sheet';
import { Button } from '@/components/ui-kit/button';
import { Input } from '@/components/ui-kit/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui-kit/popover';
import { Calendar } from '@/components/ui-kit/calendar';
import { ColorPickerTool } from '../color-picker-tool/color-picker-tool';

interface CalendarFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: { dateRange: DateRange; color: string | null }) => void;
}
/**
 * CalendarFilterSheet Component
 *
 * A filter sheet component for managing calendar filters such as date ranges and colors.
 * It provides a user interface for selecting a date range via a calendar popover and choosing
 * a color using a color picker tool. The selected filters can be applied or reset.
 *
 * Features:
 * - Date range selection using a calendar popover
 * - Color selection using a color picker tool
 * - Reset functionality to clear all filters
 * - Apply functionality to submit selected filters
 * - Dynamic control of sheet visibility
 *
 * Props:
 * - `open`: `{boolean}` – Controls the visibility of the filter sheet.
 * - `onOpenChange`: `{Function}` – Callback triggered when the sheet's visibility changes.
 * - `onApplyFilters`: `{Function}` – Callback to apply filters with data `{ dateRange: DateRange, color: string | null }`.
 *
 * @param {CalendarFiltersSheetProps} props - The props for configuring the filter sheet.
 * @example
 * <CalendarFilterSheet
 *   open={isFilterSheetOpen}
 *   onOpenChange={setIsFilterSheetOpen}
 *   onApplyFilters={(filters) => handleApplyFilters(filters)}
 * />
 */

export const CalendarFilterSheet = ({
  open,
  onOpenChange,
  onApplyFilters,
}: Readonly<CalendarFiltersSheetProps>) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [openPopover, setOpenPopover] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ from: new Date(), to: new Date() });
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent className="flex flex-col h-screen sm:h-[calc(100dvh-48px)] justify-between w-full sm:min-w-[450px] md:min-w-[450px] lg:min-w-[450px] sm:fixed sm:top-[57px]">
        <div className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="!text-left">{t('FILTERS')}</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          <div className="flex flex-col gap-6 mt-6">
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <div className="relative w-full">
                  <Input
                    placeholder={t('DATE_RANGE')}
                    className="pl-8 cursor-pointer border-dashed"
                    readOnly
                    value={
                      dateRange.from && dateRange.to
                        ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                        : ''
                    }
                    onClick={() => setOpenPopover(true)}
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-emphasis pointer-events-none" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="max-h-[80vh] overflow-y-auto">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    numberOfMonths={1}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange(range);
                        setOpenPopover(false);
                      }
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-base text-high-emphasis">{t('COLORS')}</p>
              <ColorPickerTool selectedColor={selectedColor} onColorChange={setSelectedColor} />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="w-full sm:w-1/2"
            onClick={() => {
              setSelectedColor(null);
              setDateRange({ from: new Date(), to: new Date() });
              onApplyFilters({
                dateRange: { from: undefined, to: undefined },
                color: null,
              });
            }}
          >
            {t('RESET')}
          </Button>
          <Button
            className="w-full sm:w-1/2"
            onClick={() => {
              onApplyFilters({
                dateRange,
                color: selectedColor,
              });
            }}
          >
            {t('APPLY')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
