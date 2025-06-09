import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronLeft, CalendarIcon, MoreVertical, Plus, Trash, NotebookPen } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Separator } from 'components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Textarea } from 'components/ui/textarea';
import UIPhoneInput from 'components/core/phone-input/phone-input';

interface InvoiceItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  total: number;
  showNote: boolean;
  note?: string;
}

export function CreateInvoice() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [date, setDate] = React.useState<Date>();
  const [items, setItems] = React.useState<InvoiceItem[]>([
    {
      id: '1',
      name: '',
      category: '',
      quantity: 0,
      price: 0,
      total: 0,
      showNote: false,
    },
  ]);

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
              <Input placeholder={`${t('ENTER_CUSTOMER_NAME')}...`} />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label className="text-high-emphasis text-sm">{t('EMAIL')}</Label>
              <Input placeholder={`${t('ENTER_EMAIL_ADDRESS')}...`} />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label className="text-high-emphasis text-sm">{t('PHONE_NUMBER')}</Label>
              <UIPhoneInput
                placeholder={t('ENTER_YOUR_MOBILE_NUMBER')}
                defaultCountry="CH"
                countryCallingCodeEditable={false}
                international
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label className="text-high-emphasis text-sm">{t('BILLING_ADDRESS')}</Label>
              <Input placeholder={`${t('ENTER_BILLING_ADDRESS')}...`} />
            </div>
            <div className="flex flex-col gap-[6px]">
              <Label className="text-high-emphasis text-sm">{t('DUE_DATE')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-[44px] justify-between font-normal">
                    {date ? format(date, 'PPP') : <span>{t('SELECT_DUE_DATE')}</span>}
                    <CalendarIcon className="ml-2 h-4 w-4" />
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
              <TableBody>
                {items.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow className="hover:bg-transparent">
                      <TableCell>
                        <Input
                          placeholder={`${t('ENTER_ITEM_NAME')}...`}
                          value={item.name}
                          onChange={(e) => {
                            setItems(
                              items.map((i) =>
                                i.id === item.id ? { ...i, name: e.target.value } : i
                              )
                            );
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.category}
                          onValueChange={(value) => {
                            setItems(
                              items.map((i) => (i.id === item.id ? { ...i, category: value } : i))
                            );
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('SELECT_CATEGORY')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="service">Service</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-20"
                          value={item.quantity}
                          onChange={(e) => {
                            const quantity = parseInt(e.target.value) || 0;
                            setItems(
                              items.map((i) =>
                                i.id === item.id ? { ...i, quantity, total: quantity * i.price } : i
                              )
                            );
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative w-32">
                          <span className="absolute left-3 top-[12px]">CHF</span>
                          <Input
                            className="pl-12"
                            value={item.price.toFixed(2)}
                            onChange={(e) => {
                              const price = parseFloat(e.target.value) || 0;
                              setItems(
                                items.map((i) =>
                                  i.id === item.id ? { ...i, price, total: i.quantity * price } : i
                                )
                              );
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative w-32">
                          <span className="absolute left-3 top-[12px]">CHF</span>
                          <Input className="pl-12" value={item.total.toFixed(2)} readOnly />
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setItems(
                                    items.map((i) =>
                                      i.id === item.id ? { ...i, showNote: false } : i
                                    )
                                  );
                                }}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                <span>{t('REMOVE_NOTE')}</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => {
                                  setItems(
                                    items.map((i) =>
                                      i.id === item.id ? { ...i, showNote: true } : i
                                    )
                                  );
                                }}
                              >
                                <NotebookPen className="h-4 w-4 mr-2" />
                                <span>{t('ADD_NOTE')}</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                setItems(items.filter((i) => i.id !== item.id));
                              }}
                            >
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
                          <div className="flex flex-col gap-[6px] w-[60%]">
                            <Label className="text-high-emphasis text-sm">
                              {t('NOTE')}{' '}
                              <span className="text-low-emphasis">({t('OPTIONAL')})</span>
                            </Label>
                            <Textarea
                              placeholder={`${t('WRITE_HERE')}...`}
                              className="min-h-[100px]"
                              value={item.note}
                              onChange={(e) => {
                                setItems(
                                  items.map((i) =>
                                    i.id === item.id ? { ...i, note: e.target.value } : i
                                  )
                                );
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            <div className="flex border-t border-border border-dashed py-4">
              <Button
                variant="outline"
                className="gap-1"
                onClick={() => {
                  setItems([
                    ...items,
                    {
                      id: Math.random().toString(),
                      name: '',
                      category: '',
                      quantity: 0,
                      price: 0,
                      total: 0,
                      showNote: false,
                    },
                  ]);
                }}
              >
                <Plus className="h-4 w-4 text-primary hover:text-primary" />{' '}
                <span className="text-primary hover:text-primary">{t('ADD_ITEM')}</span>
              </Button>
            </div>
          </div>

          <div className="flex w-full justify-between gap-6">
            <div className="flex flex-col gap-[6px] w-[40%]">
              <Label className="text-high-emphasis text-sm">
                {t('GENERAL_NOTE')} <span className="text-low-emphasis">({t('OPTIONAL')})</span>
              </Label>
              <Textarea placeholder={`${t('WRITE_HERE')}...`} />
            </div>
            <div className="flex flex-col gap-4 w-[40%]">
              <div className="flex justify-between">
                <span className="text-sm">{t('SUBTOTAL')}</span>
                <span className="text-sm">CHF 500.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('TAXES')}</span>
                <div className="relative w-40">
                  <Input className="text-right" defaultValue="0.00%" readOnly />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('DISCOUNT')}</span>
                <div className="flex items-center gap-2">
                  <div className="relative w-40">
                    <Input className="text-right" defaultValue="- CHF 0.00" readOnly />
                  </div>
                </div>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span className="text-sm">{t('TOTAL_AMOUNT')}</span>
                <span className="text-sm">CHF 0.00</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateInvoice;
