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
import { useMediaQuery } from '@/hooks/use-media-query';
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
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`
          ${isMobile ? 'w-full h-full max-w-none max-h-none rounded-none' : 'max-w-[1000px] h-[90vh] flex flex-col'}
          p-0 overflow-hidden
        `}
        {...props}
      >
        <div
          className={`sticky top-0 z-10 flex items-center justify-between bg-background border-b ${isMobile ? 'p-4' : 'p-6 pb-4'}`}
        >
          <DialogHeader className="flex-1">
            <DialogTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>
              Invoice Preview
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
        <div
          className={`
            ${isMobile ? 'p-2' : 'p-6 pt-4'} 
            flex-1 overflow-y-auto
          `}
        >
          <InvoicesDetail invoice={invoice} isPreview />
        </div>
      </DialogContent>
    </Dialog>
  );
}
