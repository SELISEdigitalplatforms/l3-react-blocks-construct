import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ChevronLeft, Download, Pencil, Send } from 'lucide-react';
import { Card, CardContent } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Separator } from 'components/ui/separator';
import logo from 'assets/images/construct_logo.svg';
import { Badge } from 'components/ui/badge';
import { Invoice, statusColors } from '../../data/invoice-data';
import { useToast } from 'hooks/use-toast';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';

interface InvoicesDetailProps {
  invoice: Invoice;
  isPreview?: boolean;
}

export function InvoicesDetail({ invoice, isPreview = false }: Readonly<InvoicesDetailProps>) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showSendDialog, setShowSendDialog] = useState(false);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const { subtotal, taxes, discount } = invoice.orderDetails;
  const totalAmount = subtotal + taxes - (discount ?? 0);

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
      pdf.save(`invoice-${invoice.id}.pdf`);

      toast({
        variant: 'success',
        title: t('INVOICE_DOWNLOADED'),
        description: t('DOWNLOADED_INVOICE_SUCCESSFULLY'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('SOMETHING_WENT_WRONG'),
        description: t('SOMETHING_WENT_WRONG_DOWNLOADING_INVOICE'),
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
              <h1 className="text-2xl font-semibold">{invoice.id}</h1>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex items-center gap-2">
                <p className="text-high-emphasis">{t('STATUS')}:</p>
                <Badge
                  className={`text-xs rounded-[4px] py-[2px] px-2 ${statusColors[invoice.status].text} ${statusColors[invoice.status].border} ${statusColors[invoice.status].bg} hover:${statusColors[invoice.status].bg}`}
                >
                  {invoice.status}
                </Badge>
              </div>
              <Separator orientation="vertical" className="hidden md:flex h-5 mx-1 sm:mx-3" />
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-1" />
                  {t('DOWNLOAD')}
                </Button>
                <Button variant="outline" onClick={() => navigate(`/invoices/edit/${invoice.id}`)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  {t('EDIT')}
                </Button>
                <Button
                  variant="default"
                  className="bg-primary"
                  onClick={() => setShowSendDialog(true)}
                >
                  <Send className="h-4 w-4 mr-1" />
                  {t('SEND')}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <h1 className="text-2xl font-semibold">{invoice.id}</h1>
        )}
      </div>
      <Card className="w-full border-none rounded-lg shadow-sm" ref={invoiceRef}>
        <CardContent className="flex flex-col !p-[24px] sm:!py-[56px] sm:!px-[70px] gap-6">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div className="w-[220px] h-[80px]">
              <img src={logo} alt="logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col border-l-none sm:border-l sm:border-medium-emphasis pl-4">
              <h2 className="font-semibold text-high-emphasis">Blocks Construct</h2>
              <p className="text-medium-emphasis">demo.construct@seliseblocks.com</p>
              <p className="text-medium-emphasis">+41757442538</p>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row w-full sm:justify-between">
            <div className="flex flex-col gap-2 w-[50%]">
              <h1 className="text-medium-emphasis">{t('INVOICE_DETAILS')}</h1>
              <div className="flex items-center gap-2">
                <p className="font-bold text-high-emphasis">{invoice.id}</p>
                <Badge
                  className={`text-xs rounded-[4px] py-[2px] px-2 ${statusColors[invoice.status].text} ${statusColors[invoice.status].border} ${statusColors[invoice.status].bg} hover:${statusColors[invoice.status].bg}`}
                >
                  {invoice.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-medium-emphasis">{t('DATE_ISSUED')}:</p>
                <p className="text-sm text-high-emphasis">
                  {new Date(invoice.dateIssued).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-medium-emphasis">{t('DUE_DATE')}:</p>
                <p className="text-sm text-high-emphasis">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-[50%]">
              <h3 className="text-base font-medium text-medium-emphasis mb-2">{t('BILLED_TO')}</h3>
              <p className="text-base font-bold">{invoice.customerName}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-medium-emphasis">{t('BILLING_ADDRESS')}:</p>
                <p className="text-sm text-high-emphasis">{invoice.billingInfo.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-medium-emphasis">{t('EMAIL')}:</p>
                <p className="text-sm text-high-emphasis">{invoice.billingInfo.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-medium-emphasis">{t('PHONE_NO')}:</p>
                <p className="text-sm text-high-emphasis">{invoice.billingInfo.phone}</p>
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
                {invoice.orderDetails.items.map((item) => (
                  <TableRow key={item.name} className="hover:bg-transparent">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-high-emphasis">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-medium-emphasis w-[80%]">{item.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-high-emphasis">
                      {item.category}
                    </TableCell>
                    <TableCell className="text-high-emphasis">{item.quantity}</TableCell>
                    <TableCell className="text-high-emphasis">
                      {invoice.currency} {item.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-high-emphasis">
                      {invoice.currency} {item.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col-reverse sm:flex-row w-full items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              {invoice.orderDetails.note && (
                <>
                  <div className="flex items-cnter gap-1">
                    <h3 className="font-medium text-medium-emphasis">{t('GENERAL_NOTE')}</h3>
                    <h3 className="text-low-emphasis">({t('OPTIONAL')})</h3>
                  </div>
                  <p className="text-sm text-medium-emphasis w-[64%]">
                    {invoice.orderDetails.note}
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-col gap-4 w-full sm:w-[25%]">
              <div className="flex justify-between">
                <span className="text-sm text-medium-emphasis">{t('SUBTOTAL')}</span>
                <span className="text-sm font-semibold text-high-emphasis">
                  {invoice.currency} {invoice.orderDetails.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-medium-emphasis">
                  {t('TAXES')} ({invoice.orderDetails.taxRate}%)
                </span>
                <span className="text-sm font-semibold text-high-emphasis">
                  {invoice.currency} {invoice.orderDetails.taxes.toFixed(2)}
                </span>
              </div>
              {invoice.orderDetails.discount && (
                <div className="flex justify-between">
                  <span className="text-sm text-medium-emphasis">{t('DISCOUNT')}</span>
                  <span className="text-sm font-semibold text-secondary">
                    - {invoice.currency} {invoice.orderDetails.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-4">
                <span className="font-semibold text-high-emphasis">{t('TOTAL_AMOUNT')}</span>
                <span className="text-xl font-bold text-high-emphasis">
                  {invoice.currency} {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <Separator />
          <p className="text-sm text-medium-emphasis">
            Please make sure that payments are within the stated due date. Thank you for your
            business.
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
