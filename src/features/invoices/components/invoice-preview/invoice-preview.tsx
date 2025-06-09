import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { InvoicesDetail } from '../invoices-detail/invoices-detail';
import { Invoice } from '../../data/invoice-data';

interface InvoicePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function InvoicePreview({ open, onOpenChange, invoice }: InvoicePreviewProps) {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle />
        <DialogDescription />
      </DialogHeader>
      <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-y-auto p-8">
        <InvoicesDetail invoice={invoice} isPreview />
      </DialogContent>
    </Dialog>
  );
}
