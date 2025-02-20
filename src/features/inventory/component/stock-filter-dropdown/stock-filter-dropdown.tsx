import { useState } from 'react';
import { Input } from 'components/ui/input';
import { Updater } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import { Button } from 'components/ui/button';
import { Label } from 'components/ui/label';

interface StockFilterDropdownProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFilterValue: (updater: Updater<any>) => void;
}

export function StockFilterDropdown({ setFilterValue }: StockFilterDropdownProps) {
  const [openStockDropdown, setOpenStockDropdown] = useState(false);
  const [stockAmount, setStockAmount] = useState('0');
  const [stockFilter, setStockFilter] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStockAmount(value);
    applyFilter(value, stockFilter);
  };

  const handleFilterChange = (value: string) => {
    setStockFilter(value);
    applyFilter(stockAmount, value);
  };

  const applyFilter = (amount: string, filter: string) => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && filter) {
      setFilterValue({
        type: filter,
        amount: parsedAmount,
      });
    }
  };

  const handleClearFilter = () => {
    setStockFilter('');
    setStockAmount('0');
    setFilterValue('');
    setOpenStockDropdown(false);
  };

  return (
    <DropdownMenu open={openStockDropdown} onOpenChange={setOpenStockDropdown}>
      <DropdownMenuTrigger asChild className="text-right">
        <Input
          value={stockAmount}
          onChange={handleAmountChange}
          className="rounded-[6px] h-10"
          onClick={() => setOpenStockDropdown(true)}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="p-4 space-y-3 z-50 bg-white border rounded-lg shadow-lg"
      >
        <RadioGroup value={stockFilter} onValueChange={handleFilterChange}>
          {[
            { value: 'less_than', label: 'Less than' },
            { value: 'more_than', label: 'More than' },
            { value: 'equal_to', label: 'Equal to' },
            { value: 'no_entry', label: 'No entry' },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <div className="flex flex-col gap-1">
          <Label className="text-sm font-normal">Amount</Label>
          <Input
            value={stockAmount}
            onChange={handleAmountChange}
            placeholder="Enter stock amount"
          />
        </div>
        <Button variant="ghost" className="w-full" size="sm" onClick={handleClearFilter}>
          Clear filter
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
