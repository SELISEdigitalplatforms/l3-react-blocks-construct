import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ChevronLeft, Download, Pencil, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui-kit/card';
import { Button } from '@/components/ui-kit/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui-kit/table';
import { Separator } from '@/components/ui-kit/separator';
import darkLogo from '@/assets/images/construct_logo_dark.svg';
import lightLogo from '@/assets/images/construct_logo_light.svg';
import { Badge } from '@/components/ui-kit/badge';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/core';
import { InvoiceItem, InvoiceStatus, getStatusColors } from '../../types/invoices.types';
import { useTheme } from '@/styles/theme/theme-provider';

interface InvoicesDetailProps {
  invoice: InvoiceItem;
  isPreview?: boolean;
}

export function InvoicesDetail({ invoice, isPreview = false }: Readonly<InvoicesDetailProps>) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showSendDialog, setShowSendDialog] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const subtotal = Number(
    invoice.ItemDetails?.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0).toFixed(2) ?? 0
  );

  const discount = Number(invoice.Discount) || 0;

  const isTaxPercentage = invoice.Taxes && invoice.Taxes <= 100;

  const calculateTaxRate = () => {
    if (subtotal <= 0) return '0.00';

    if (isTaxPercentage) {
      return Number(invoice.Taxes).toFixed(2);
    }

    return ((taxAmount / subtotal) * 100).toFixed(2);
  };

  const taxAmount = isTaxPercentage
    ? Number((subtotal * (Number(invoice.Taxes) / 100)).toFixed(2))
    : Number(invoice.Taxes) || 0;

  const taxRate = calculateTaxRate();

  const totalAmount = Math.max(0, Number((subtotal + taxAmount - discount).toFixed(2)));

  const handleSendInvoice = () => {
    setShowSendDialog(false);
    toast({
      variant: 'success',
      title: t('INVOICE_SENT'),
      description: t('INVOICE_SENT_SUCCESSFULLY'),
    });
  };

  const handleDownloadPDF = async () => {
    try {
      const element = invoiceRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${invoice.ItemId}.pdf`);

      toast({
        variant: 'success',
        title: t('INVOICE_DOWNLOADED'),
        description: t('INVOICE_DOWNLOADED_SUCCESSFULLY'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('UNABLE_PROCESS_REQUEST'),
        description: t('ISSUE_GENERATING_INVOICE'),
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 sm:items-center sm:justify-between">
        {!isPreview ? (
          <>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="bg-card hover:bg-card/60 rounded-full"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-semibold uppercase">{invoice.ItemId}</h1>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex items-center gap-2">
                <p className="text-high-emphasis">{t('STATUS')}:</p>
                <Badge
                  className={`text-xs rounded-[4px] py-[2px] px-2 ${getStatusColors(invoice.Status || 'Draft').text} ${getStatusColors(invoice.Status || 'Draft').border} ${getStatusColors(invoice.Status || 'Draft').bg} hover:${getStatusColors(invoice.Status || 'Draft').bg}`}
                >
                  {invoice.Status ?? InvoiceStatus.DRAFT}
                </Badge>
              </div>
              <Separator orientation="vertical" className="hidden md:flex h-5 mx-1 sm:mx-3" />
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">{t('DOWNLOAD')}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/invoices/${invoice.ItemId}/edit`)}
                >
                  <Pencil className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">{t('EDIT')}</span>
                </Button>
                {/* To hide edit button for users without write access use permissions={[MENU_PERMISSIONS.INVOICE_WRITE]} 
                <PermissionGuard permissions={[MENU_PERMISSIONS.INVOICE_WRITE]} fallbackType="dialog" showFallback={false}>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/invoices/${invoice.ItemId}/edit`)}
                  >
                    <Pencil className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">{t('EDIT')}</span>
                  </Button>
                </PermissionGuard>
                */}
                <Button
                  variant="default"
                  className="bg-primary"
                  onClick={() => setShowSendDialog(true)}
                >
                  <Send className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">{t('SEND')}</span>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <h1 className="text-2xl font-semibold">{invoice.ItemId}</h1>
        )}
      </div>
      <Card className="w-full border-none rounded-lg shadow-sm" ref={invoiceRef}>
        <CardContent className="flex flex-col !p-[24px] sm:!py-[56px] sm:!px-[70px] gap-6">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div className="w-[220px] h-[80px]">
              <img
                src={theme === 'dark' ? lightLogo : darkLogo}
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col border-l-none sm:border-l sm:border-medium-emphasis pl-4">
              <h2 className="font-semibold text-high-emphasis">Blocks Construct</h2>
              <p className="text-medium-emphasis">demo.construct@seliseblocks.com</p>
              <p className="text-medium-emphasis">+41757442538</p>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row w-full sm:justify-between">
            <div className="flex flex-col gap-2 w-full md:w-[50%]">
              <h1 className="text-medium-emphasis">{t('INVOICE_DETAILS')}</h1>
              <div className="flex items-center gap-2">
                <p className="font-bold text-high-emphasis uppercase">{invoice.ItemId}</p>
                <Badge
                  className={`text-xs rounded-[4px] py-[2px] px-2 ${getStatusColors(invoice.Status).text} ${getStatusColors(invoice.Status).border} ${getStatusColors(invoice.Status).bg} hover:${getStatusColors(invoice.Status).bg}`}
                >
                  {invoice.Status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-medium-emphasis">{t('DATE_ISSUED')}:</p>
                <p className="text-sm text-high-emphasis">
                  {new Date(invoice.DateIssued).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-medium-emphasis">{t('DUE_DATE')}:</p>
                <p className="text-sm text-high-emphasis">
                  {new Date(invoice.DueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-[50%]">
              <h3 className="text-base font-medium text-medium-emphasis mb-2">{t('BILLED_TO')}</h3>
              <p className="text-base font-bold">{invoice.Customer[0].CustomerName}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-medium-emphasis">{t('BILLING_ADDRESS')}:</p>
                <p className="text-sm text-high-emphasis">{invoice.Customer[0].BillingAddress}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-medium-emphasis">{t('EMAIL')}:</p>
                <p className="text-sm text-high-emphasis">{invoice.Customer[0].Email}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-medium-emphasis">{t('PHONE_NO')}:</p>
                <p className="text-sm text-high-emphasis">{invoice.Customer[0].PhoneNo}</p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col w-full gap-6">
            <h3 className="text-xl font-medium text-medium-emphasis">{t('ORDER_DETAILS')}</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-medium-emphasis bg-surface hover:bg-surface">
                  <TableHead className="text-high-emphasis font-semibold">
                    {t('ITEM_NAME')}
                  </TableHead>
                  <TableHead className="text-high-emphasis font-semibold">
                    {t('CATEGORY')}
                  </TableHead>
                  <TableHead className="text-high-emphasis font-semibold">
                    {t('QUANTITY')}
                  </TableHead>
                  <TableHead className="text-high-emphasis font-semibold">
                    {t('UNIT_PRICE')}
                  </TableHead>
                  <TableHead className="text-high-emphasis font-semibold">{t('AMOUNT')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(invoice.ItemDetails || []).map((item) => (
                  <TableRow key={item.ItemId} className="hover:bg-transparent">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-high-emphasis">{item.ItemName}</p>
                        {item.Note && (
                          <p className="text-sm text-medium-emphasis w-[80%]">{item.Note}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-high-emphasis">
                      {item.Category}
                    </TableCell>
                    <TableCell className="text-high-emphasis">{item.Quantity}</TableCell>
                    <TableCell className="text-high-emphasis">
                      <span className="text-medium-emphasis uppercase">{invoice.Currency} </span>
                      {item.UnitPrice}
                    </TableCell>
                    <TableCell className="text-high-emphasis">
                      <span className="text-medium-emphasis uppercase">{invoice.Currency} </span>
                      {item.Amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col-reverse sm:flex-row w-full items-start sm:justify-between">
            <div className="flex flex-col gap-2 w-full md:w-[50%]">
              {invoice.GeneralNote && (
                <>
                  <div className="flex items-cnter gap-1">
                    <h3 className="font-medium text-medium-emphasis">{t('GENERAL_NOTE')}</h3>
                    <h3 className="text-low-emphasis">({t('OPTIONAL')})</h3>
                  </div>
                  <p className="text-sm text-medium-emphasis w-[64%]">{invoice.GeneralNote}</p>
                </>
              )}
            </div>
            <div className="flex flex-col gap-4 w-full sm:w-[25%]">
              <div className="flex justify-between">
                <span className="text-sm text-medium-emphasis">{t('SUBTOTAL')}</span>
                <span className="text-sm font-semibold text-high-emphasis">
                  <span className="text-medium-emphasis uppercase">{invoice.Currency} </span>
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-medium-emphasis">
                  {t('TAXES')} ({taxRate}%)
                </span>
                <span className="text-sm font-semibold text-high-emphasis">
                  <span className="text-medium-emphasis uppercase">{invoice.Currency} </span>
                  {taxAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-medium-emphasis">{t('DISCOUNT')}</span>
                <span className="text-sm font-semibold text-high-emphasis">
                  <span className="text-medium-emphasis uppercase">-{invoice.Currency} </span>
                  {discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-4">
                <span className="font-semibold text-high-emphasis">{t('TOTAL_AMOUNT')}</span>
                <span className="text-xl font-bold text-high-emphasis">
                  <span className="text-medium-emphasis uppercase">{invoice.Currency} </span>
                  {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <Separator />
          <p className="text-sm text-medium-emphasis">
            {t('PLEASE_MAKE_SURE_PAYMENT_WITHIN_DUEDATE')}
          </p>
        </CardContent>
      </Card>
      <ConfirmationModal
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        title={t('SEND_INVOICE')}
        description={t('SAVE_INVOICE_SEND_CUSTOMER_EMAIL')}
        onConfirm={handleSendInvoice}
      />
    </div>
  );
}

export default InvoicesDetail;
