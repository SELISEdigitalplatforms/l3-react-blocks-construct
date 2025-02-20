import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
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

interface LastUpdatedFilterDropdownProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFilterValue: (updater: Updater<any>) => void;
}

export function LastUpdatedFilterDropdown({ setFilterValue }: LastUpdatedFilterDropdownProps) {
  const [openLastUpdatedDropdown, setOpenLastUpdatedDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [date, setDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });

  const validOptions = ['today', 'date', 'date_range', 'before', 'after'];

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);

    if (value === 'today' || value === 'before' || value === 'after') {
      setDate(new Date());
      setFilterValue({
        date: new Date(),
        type: value,
      });
    } else if (value === 'no_entry') {
      setFilterValue({
        type: value,
      });
    }
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
      setFilterValue({ ...range, type: selectedOption });
    }
  };

  return (
    <DropdownMenu open={openLastUpdatedDropdown} onOpenChange={setOpenLastUpdatedDropdown}>
      <div className="relative">
        <div className="relative w-full">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-medium-emphasis w-4 h-4" />
          <Input
            placeholder="Date"
            className="rounded-[6px] h-10 pl-10"
            onFocus={() => setOpenLastUpdatedDropdown(true)}
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
              { value: 'today', label: 'Today' },
              { value: 'date', label: 'Date' },
              { value: 'date_range', label: 'Date range' },
              { value: 'after', label: 'After' },
              { value: 'before', label: 'Before' },
              { value: 'no_entry', label: 'No entry' },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <label htmlFor={option.value} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
          {validOptions.includes(selectedOption) && (
            <div>
              <Label className="text-sm font-normal">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative w-full">
                    <Input
                      value={
                        selectedOption === 'date_range'
                          ? dateRange?.from && dateRange?.to
                            ? `${format(dateRange.from, 'yyyy-MM-dd')} - ${format(dateRange.to, 'yyyy-MM-dd')}`
                            : ''
                          : date
                            ? format(date, 'yyyy-MM-dd')
                            : ''
                      }
                      readOnly
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-medium-emphasis w-4 h-4" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  {selectedOption === 'date_range' ? (
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={handleDateRangeSelect}
                      numberOfMonths={2}
                    />
                  ) : (
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        setFilterValue({
                          date: selectedDate,
                          type: selectedOption,
                        });
                      }}
                    />
                  )}
                </PopoverContent>
              </Popover>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full"
            size="sm"
            onClick={() => {
              setSelectedOption('');
              setFilterValue(undefined);
            }}
          >
            Clear filter
          </Button>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
