import { useParams, useNavigate } from 'react-router-dom';
import { InvoicesDetail } from 'features/invoices';
import { invoiceData, Invoice } from 'features/invoices/data/invoice-data';

export function InvoiceDetailsPage() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  
  const invoice = invoiceData.find((inv: Invoice) => inv.id === invoiceId);
  
  if (!invoice) {
    return <div className="p-8">Invoice not found</div>;
  }

  return (
    <InvoicesDetail 
      invoice={invoice} 
      onBack={() => navigate('/invoices')} 
    />
  );
}
