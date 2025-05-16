import { Download, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import FinanceOverview from 'features/finance/components/finance-overview/finance-overview';
import FinanceProfitOverviewGraph from 'features/finance/components/finance-profit-overview-graph/finance-profit-overview-graph';
import FinanceRevenueExpenseGraph from 'features/finance/components/finance-revenue-expense-graph/finance-revenue-expense-graph';
import FinanceInvoices from 'features/finance/components/finance-invoices/finance-invoices';

export default function Finance() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col">
      <div className="mb-[18px] flex items-center justify-between md:mb-[32px]">
        <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">{t('FINANCE')}</h3>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="text-high-emphasis hover:text-high-emphasis  font-bold"
          >
            <RefreshCcw className="w-2.5 h-2.5" />
            <span className="text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
              {t('SYNC')}
            </span>
          </Button>
          <Button className="font-bold">
            <Download className="w-2.5 h-2.5" />
            <span className="text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
              {t('EXPORT')}
            </span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <FinanceOverview />
        <div className="flex flex-col md:flex-row gap-4">
          <FinanceProfitOverviewGraph />
          <FinanceRevenueExpenseGraph />
        </div>
        <FinanceInvoices />
      </div>
    </div>
  );
}
