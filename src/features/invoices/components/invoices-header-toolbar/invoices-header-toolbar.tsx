import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from 'components/ui/button';

interface InvoicesHeaderToolbarProps {
  title?: string;
}

export function InvoicesHeaderToolbar({
  title = 'INVOICES',
}: Readonly<InvoicesHeaderToolbarProps>) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center text-base text-high-emphasis">
        <h3 className="text-2xl font-bold tracking-tight">{t(title)}</h3>
      </div>
      <Link to="/invoices/create-invoice">
        <Button size="sm" className="text-sm font-bold">
          <Plus />
          {t('NEW_INVOICE')}
        </Button>
      </Link>
    </div>
  );
}

export default InvoicesHeaderToolbar;
