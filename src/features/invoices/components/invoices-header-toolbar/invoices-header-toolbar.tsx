import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from 'components/ui/button';
import { PermissionGuard } from 'components/blocks/gurads/permission-guard/permission-guard';
import { MENU_PERMISSIONS } from 'config/roles-permissions';

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
      <PermissionGuard
        permissions={[MENU_PERMISSIONS.INVOICE_WRITE]}
        fallbackType="dialog"
        showFallback={false}
      >
        <Link to="/invoices/create-invoice">
          <Button size="sm" className="text-sm font-bold">
            <Plus />
            {t('NEW_INVOICE')}
          </Button>
        </Link>
      </PermissionGuard>
    </div>
  );
}

export default InvoicesHeaderToolbar;
