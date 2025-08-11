import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Control } from 'react-hook-form';
import { MoreVertical, NotebookPen, Plus, Trash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { Label } from 'components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Textarea } from 'components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Categories, InvoiceItemDetails } from '../../types/invoices.types';

interface InvoiceItemsTableProps {
  items: InvoiceItemDetails[];
  onUpdateItem: (id: string, updates: Partial<InvoiceItemDetails>) => void;
  onRemoveItem: (id: string) => void;
  onToggleNote: (id: string) => void;
  onAddItem: () => void;
  control: Control<any>;
  subtotal: number;
  taxRate: number;
  discount: number;
  totalAmount: number;
  currency: string;
}

export function InvoiceItemsTable({
  items,
  onUpdateItem,
  onRemoveItem,
  onToggleNote,
  onAddItem,
  control,
  subtotal,
  taxRate,
  discount,
  totalAmount,
  currency,
}: Readonly<InvoiceItemsTableProps>) {
  const { t } = useTranslation();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-medium-emphasis bg-surface hover:bg-surface">
            <TableHead>{t('ITEM_NAME')}</TableHead>
            <TableHead>{t('CATEGORY')}</TableHead>
            <TableHead>{t('QUANTITY')}</TableHead>
            <TableHead>{t('UNIT_PRICE')}</TableHead>
            <TableHead>{t('AMOUNT')}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <Fragment key={item.ItemId}>
              <TableRow className="hover:bg-transparent">
                <TableCell>
                  <Input
                    placeholder={`${t('ENTER_ITEM_NAME')}...`}
                    value={item.ItemName}
                    onChange={(e) => onUpdateItem(item.ItemId, { ItemName: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={item.Category}
                    onValueChange={(value) => onUpdateItem(item.ItemId, { Category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('SELECT_CATEGORY')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    className="w-20"
                    value={item.Quantity}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value) || 0;
                      onUpdateItem(item.ItemId, { Quantity: quantity });
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-[12px]">{currency}</span>
                    <Input
                      className="pl-12"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={item.UnitPrice === 0 ? '' : item.UnitPrice}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          onUpdateItem(item.ItemId, { UnitPrice: 0 });
                          return;
                        }
                        const price = parseFloat(value);
                        if (!isNaN(price)) {
                          onUpdateItem(item.ItemId, { UnitPrice: price });
                        }
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-[12px]">{currency}</span>
                    <Input className="pl-12" value={item.Amount.toFixed(2)} readOnly />
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.showNote ? (
                        <DropdownMenuItem onClick={() => onToggleNote(item.ItemId)}>
                          <Trash className="h-4 w-4 mr-2" />
                          <span>{t('REMOVE_NOTE')}</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onToggleNote(item.ItemId)}>
                          <NotebookPen className="h-4 w-4 mr-2" />
                          <span>{t('ADD_NOTE')}</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onRemoveItem(item.ItemId)}>
                        <Trash className="h-4 w-4 mr-2" />
                        <span>{t('REMOVE_ITEM')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              {item.showNote && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6}>
                    <div className="flex flex-col gap-[6px] w-[40%]">
                      <Label className="text-high-emphasis text-sm">
                        {t('NOTE')} <span className="text-low-emphasis">({t('OPTIONAL')})</span>
                      </Label>
                      <Textarea
                        placeholder={`${t('WRITE_HERE')}...`}
                        className="min-h-[100px]"
                        value={item.Note}
                        onChange={(e) => onUpdateItem(item.ItemId, { Note: e.target.value })}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-6 border-t border-border border-dashed py-4">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-6 w-[40%]">
            <Button type="button" variant="outline" className="w-[120px]" onClick={onAddItem}>
              <Plus className="h-4 w-4 mr-2 text-primary" />
              <span className="text-primary hover:text-primary">{t('ADD_ITEM')}</span>
            </Button>

            <FormField
              control={control}
              name="generalNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-high-emphasis text-sm">
                    {t('GENERAL_NOTE')} ({t('OPTIONAL')})
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder={`${t('WRITE_HERE')}...`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4 w-[40%]">
            <div className="flex justify-between">
              <span className="text-sm">{t('SUBTOTAL')}</span>
              <span className="text-sm font-medium">
                {currency} {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('TAXES')}</span>
              <div className="w-40">
                <Input className="text-right" value={`${taxRate.toFixed(2)}%`} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('DISCOUNT')}</span>
              <div className="w-40">
                <Input className="text-right" value={`- ${currency} ${discount.toFixed(2)}`} />
              </div>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span className="text-sm">{t('TOTAL_AMOUNT')}</span>
              <span className="text-sm">
                {currency} {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
