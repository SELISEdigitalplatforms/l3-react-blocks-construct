import { forwardRef, useImperativeHandle, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Updater } from '@tanstack/react-table';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Input } from 'components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import { Button } from 'components/ui/button';
import { Label } from 'components/ui/label';
import { Calendar } from 'components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

/**
 * LastUpdatedFilterDropdown is a dropdown component for filtering items based on their last updated date.
 * It allows the user to select a filter option (e.g., "Today", "Before", "After", or "Date Range") and
 * either specify a specific date or range of dates. It provides an option to clear the filter.
 *
 * @component
 * @example
 * const setFilterValue = (filter) => {
 *   // Logic to set the filter value
 * };
 * return (
 *   <LastUpdatedFilterDropdown setFilterValue={setFilterValue} />
 * );
 *
 * @param {Object} props - The props for the LastUpdatedFilterDropdown component.
 * @param {function} props.setFilterValue - Callback function to set the selected filter value.
 * @param {React.Ref} ref - A reference that can be used to call the `clearFilter` method.
 *
 * @returns {JSX.Element} The rendered LastUpdatedFilterDropdown component.
 */

interface LastUpdatedFilterDropdownProps {
  setFilterValue: (updater: Updater<any>) => void;
}

const LastUpdatedFilterDropdown = forwardRef<
  { clearFilter: VoidFunction },
  Readonly<LastUpdatedFilterDropdownProps>
>(({ setFilterValue }, ref) => {
  const { t } = useTranslation();
  const [openLastUpdatedDropdown, setOpenLastUpdatedDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [openPopover, setOpenPopover] = useState(false);
  const [date, setDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange>({ from: new Date(), to: new Date() });

  const validOptions = ['today', 'date', 'date_range', 'before', 'after'];

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);

    if (['today', 'before', 'after'].includes(value)) {
      setDate(new Date());
      setFilterValue({ date: new Date(), type: value });
    } else if (value === 'no_entry') {
      setFilterValue({ type: value });
    }
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range) return;
    setDateRange(range);
    setFilterValue({ ...range, type: selectedOption });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setFilterValue({ date: selectedDate, type: selectedOption });
    setOpenPopover(false);
  };

  const handleClearFilter = () => {
    setSelectedOption('');
    setDate(undefined);
    setDateRange({ from: undefined, to: undefined });
    setFilterValue(undefined);
    setOpenLastUpdatedDropdown(false);
  };

  useImperativeHandle(ref, () => ({
    clearFilter: handleClearFilter,
  }));

  const getFormattedValue = () => {
    if (selectedOption === 'no_entry') return 'No entry';
    if (selectedOption === 'date_range' && dateRange?.from && dateRange?.to)
      return `${format(dateRange.from, 'yyyy-MM-dd')} - ${format(dateRange.to, 'yyyy-MM-dd')}`;
    return date ? format(date, 'yyyy-MM-dd') : '';
  };

  return (
    <DropdownMenu open={openLastUpdatedDropdown} onOpenChange={setOpenLastUpdatedDropdown}>
      <div className="relative">
        <div className="relative w-full">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-medium-emphasis w-4 h-4" />
          <Input
            placeholder={t('DATE')}
            className="rounded-[6px] h-10 pl-10"
            onFocus={() => setOpenLastUpdatedDropdown(true)}
            value={getFormattedValue()}
            readOnly
          />
        </div>
        <DropdownMenuTrigger asChild>
          <button className="absolute inset-0" aria-label="Open dropdown" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="p-4 !w-[248px] space-y-3 z-50 bg-white border rounded-lg shadow-lg"
        >
          <RadioGroup value={selectedOption} onValueChange={handleOptionChange}>
            {[
              { value: 'today', label: 'TODAY' },
              { value: 'date', label: 'DATE' },
              { value: 'date_range', label: 'DATE_RANGE' },
              { value: 'after', label: 'AFTER' },
              { value: 'before', label: 'BEFORE' },
              { value: 'no_entry', label: 'NO_ENTRY' },
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={value} />
                <label htmlFor={value} className="text-sm">
                  {t(label)}
                </label>
              </div>
            ))}
          </RadioGroup>

          {validOptions.includes(selectedOption) && (
            <div>
              <Label className="text-sm font-normal">{t('DATE')}</Label>
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger
                  onClick={() => selectedOption !== 'today' && setOpenPopover(true)}
                  asChild
                >
                  <div className="relative w-full">
                    <Input
                      placeholder={
                        selectedOption === 'date_range' ? t('SELECT_DATE_RANGE') : t('SELECT_DATE')
                      }
                      value={getFormattedValue()}
                      disabled={selectedOption === 'today'}
                      readOnly
                    />
                    <CalendarIcon
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${selectedOption === 'today' ? 'text-low-emphasis' : 'text-medium-emphasis'}`}
                    />
                  </div>
                </PopoverTrigger>
                {selectedOption !== 'today' && (
                  <PopoverContent className="w-auto p-0">
                    {selectedOption === 'date_range' ? (
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={handleDateRangeSelect}
                        numberOfMonths={2}
                      />
                    ) : (
                      <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
                    )}
                  </PopoverContent>
                )}
              </Popover>
            </div>
          )}
          <Button variant="ghost" className="w-full" size="sm" onClick={handleClearFilter}>
            {t('CLEAR_FILTER')}
          </Button>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
});

LastUpdatedFilterDropdown.displayName = 'LastUpdatedFilterDropdown';

export default LastUpdatedFilterDropdown;
