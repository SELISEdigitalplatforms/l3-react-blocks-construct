import { X } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui-kit/dialog';
import { Button } from '@/components/ui-kit/button';
import { InvoicesDetail } from '../invoices-detail/invoices-detail';
import { InvoiceItem } from '../../types/invoices.types';

interface InvoicePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceItem | null;
  [key: string]: any;
}

export function InvoicePreview({
  open,
  onOpenChange,
  invoice,
  ...props
}: Readonly<InvoicePreviewProps>) {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-full h-full max-w-none max-h-none rounded-none
          md:max-w-[1000px] md:h-[90vh] md:flex md:flex-col md:rounded-lg
          p-0 overflow-hidden
        "
        {...props}
      >
        <div
          className="
            sticky top-0 z-10 flex items-center justify-between bg-background border-b
            p-4
            md:p-6 md:pb-4
          "
        >
          <DialogHeader className="flex-1">
            <DialogTitle className="text-lg md:text-xl font-semibold">Invoice Preview</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
        <div
          className="
            p-2
            md:p-6 md:pt-4
            flex-1 overflow-y-auto
          "
        >
          <InvoicesDetail invoice={invoice} isPreview />
        </div>
      </DialogContent>
    </Dialog>
  );
}
