import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

/**
 * StockFilterDropdown is a dropdown component that allows users to filter stock items based on the stock amount.
 * Users can specify a filter option (e.g., "Less than", "More than", "Equal to", or "No entry") and enter a stock amount to apply the filter.
 * It provides an option to clear the filter.
 *
 * @component
 * @example
 * const setFilterValue = (filter) => {
 *   // Logic to set the filter value
 * };
 * return (
 *   <StockFilterDropdown setFilterValue={setFilterValue} />
 * );
 *
 * @param {Object} props - The props for the StockFilterDropdown component.
 * @param {function} props.setFilterValue - Callback function to set the selected filter value.
 * @param {React.Ref} ref - A reference that can be used to call the `clearFilter` method.
 *
 * @returns {JSX.Element} The rendered StockFilterDropdown component.
 */

interface StockFilterDropdownProps {
  setFilterValue: (updater: Updater<any>) => void;
}

const StockFilterDropdown = forwardRef<
  { clearFilter: VoidFunction },
  Readonly<StockFilterDropdownProps>
>(({ setFilterValue }, ref) => {
  const { t } = useTranslation();
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

  useImperativeHandle(ref, () => ({
    clearFilter: handleClearFilter,
  }));

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
          <Label className="text-sm font-normal">{t('AMOUNT')}</Label>
          <Input
            value={stockAmount}
            onChange={handleAmountChange}
            placeholder={t('ENTER_STOCK_AMOUNT')}
          />
        </div>
        <Button variant="ghost" className="w-full" size="sm" onClick={handleClearFilter}>
          {t('CLEAR_FILTER')}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

StockFilterDropdown.displayName = 'StockFilterDropdown';

export default StockFilterDropdown;
