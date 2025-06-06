import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronLeft, CalendarIcon, MoreVertical, Plus } from 'lucide-react';
import { Card, CardContent } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { Calendar } from 'components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { Separator } from 'components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';

export function CreateInvoice() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="bg-card hover:bg-card/60 rounded-full"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">{t('CREATE_NEW_INVOICE')}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">{t('PREVIEW')}</Button>
          <Button variant="outline">{t('SAVE_AS_DRAFT')}</Button>
          <Button>{t('SAVE_AND_SEND')}</Button>
        </div>
      </div>

      <Card className="w-full border-none rounded-[8px] shadow-sm">
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">{t('GENERAL_INFO')}</h2>
          <Separator />
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-[6px]">
              <Label className="text-high-emphasis text-sm">{t('CUSTOMER_NAME')}</Label>
              <Input placeholder={`${t('WRITE_HERE')}...`} />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label className="text-high-emphasis text-sm">{t('EMAIL')}</Label>
              <Input placeholder={`${t('WRITE_HERE')}...`} />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label className="text-high-emphasis text-sm">{t('PHONE_NUMBER')}</Label>
              <Input placeholder={`${t('WRITE_HERE')}...`} />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label className="text-high-emphasis text-sm">{t('BILLING_ADDRESS')}</Label>
              <Input placeholder={`${t('WRITE_HERE')}...`} />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label className="text-high-emphasis text-sm">{t('DUE_DATE')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>{t('SELECT')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label className="text-high-emphasis text-sm">{t('CURRENCY')}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('SELECT')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chf">CHF</SelectItem>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full border-none rounded-[8px] shadow-sm">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{t('ITEM_DETAILS')}</h2>
            <Separator />
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
              <TableBody>c
                <TableRow>
                  <TableCell>
                    <Input placeholder={`${t('WRITE_HERE')}...`} />
                  </TableCell>
                  <TableCell>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('SELECT')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input type="number" defaultValue="0" className="w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="relative w-32">
                      <span className="absolute left-3 top-2.5">CHF</span>
                      <Input className="pl-12" defaultValue="0.00" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="relative w-32">
                      <span className="absolute left-3 top-2.5">CHF</span>
                      <Input className="pl-12" defaultValue="00.00" readOnly />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex border-t border-border border-dashed py-4">
              <Button variant="outline" className="gap-1">
                <Plus className="h-4 w-4 text-primary hover:text-primary" />{' '}
                <span className="text-primary hover:text-primary">{t('ADD_ITEM')}</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-[6px]">
              <Label className="text-high-emphasis text-sm">
                {t('GENERAL_NOTE')} ({t('OPTIONAL')})
              </Label>
              <Input placeholder={`${t('WRITE_HERE')}...`} />
            </div>
            <div className="flex justify-end gap-8">
              <div className="flex flex-col gap-[6px] text-right min-w-[200px]">
                <div className="flex justify-between">
                  <span className="text-sm">{t('SUBTOTAL')}</span>
                  <span className="text-sm">CHF 00.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t('TAXES')}</span>
                  <div className="relative w-20">
                    <Input className="text-right pr-6" defaultValue="0.00" />
                    <span className="absolute right-2 top-2.5">%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t('DISCOUNT')}</span>
                  <div className="flex items-center gap-2">
                    <span>-</span>
                    <div className="relative w-20">
                      <span className="absolute left-2 top-2.5">CHF</span>
                      <Input className="text-right pl-10" defaultValue="0.00" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span className="text-sm">{t('TOTAL_AMOUNT')}</span>
                  <span className="text-sm">CHF 0.00</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateInvoice;
