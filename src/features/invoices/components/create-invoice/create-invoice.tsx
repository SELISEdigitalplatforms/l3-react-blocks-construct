import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Button } from 'components/ui/button';

export function CreateInvoice() {
  const { t } = useTranslation();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
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
    pdf.save('invoice.pdf');
  };

  return (
    <div className="bg-muted min-h-screen p-8 flex flex-col items-center">
      <Card className="w-full max-w-2xl" ref={invoiceRef}>
        <CardHeader>
          <CardTitle className="text-xl text-high-emphasis">{t('OVERVIEW')}</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent className="p-6 text-black">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Your Company</h2>
              <p className="text-sm">123 Dzong Road</p>
              <p className="text-sm">Thimphu, Bhutan</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold">INVOICE</h1>
              <p className="text-sm">#INV-00123</p>
              <p className="text-sm">Date: 2025-06-02</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Bill To:</h3>
            <p className="text-sm">John Doe</p>
            <p className="text-sm">456 Client Street</p>
            <p className="text-sm">Punakha, Bhutan</p>
          </div>

          <table className="w-full text-sm border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-left">Item</th>
                <th className="border px-2 py-1 text-right">Qty</th>
                <th className="border px-2 py-1 text-right">Rate</th>
                <th className="border px-2 py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">Web Development</td>
                <td className="border px-2 py-1 text-right">1</td>
                <td className="border px-2 py-1 text-right">$1000</td>
                <td className="border px-2 py-1 text-right">$1000</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Hosting (1 year)</td>
                <td className="border px-2 py-1 text-right">1</td>
                <td className="border px-2 py-1 text-right">$120</td>
                <td className="border px-2 py-1 text-right">$120</td>
              </tr>
            </tbody>
          </table>

          <div className="text-right">
            <p className="text-sm">Subtotal: $1120</p>
            <p className="text-sm">Tax (10%): $112</p>
            <p className="text-lg font-bold">Total: $1232</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleDownloadPDF} className="mt-6">
        Download Invoice as PDF
      </Button>
    </div>
  );
}

export default CreateInvoice;
