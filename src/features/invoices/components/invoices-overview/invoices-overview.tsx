import { useTranslation } from 'react-i18next';
import { FileText, Clock, CheckCircle, AlertCircle, FileEdit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Separator } from 'components/ui/separator';
import InvoiceTable from '../invoice-table/invoice-table';

export function InvoicesOverview() {
  const { t } = useTranslation();

  return (
    <Card className="w-full border-none rounded-[8px] shadow-sm">
      <CardHeader className="!pb-0">
        <CardTitle className="text-xl text-high-emphasis">{t('OVERVIEW')}</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="flex flex-col hover:bg-primary-50 cursor-pointer gap-2 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-medium-emphasis">
                {t('TOTAL_INVOICES')}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-high-emphasis">120</h3>
              <p className="text-base font-medium text-high-emphasis">CHF 82,564.00</p>
            </div>
          </div>
          <div className="flex flex-col hover:bg-primary-50 cursor-pointer gap-2 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-success-background">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <span className="text-sm font-medium text-medium-emphasis">{t('PAID')}</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-high-emphasis">73</h3>
              <p className="text-base font-medium text-high-emphasis">CHF 35,200.00</p>
            </div>
          </div>
          <div className="flex flex-col hover:bg-primary-50 cursor-pointer gap-2 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warning-background">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <span className="text-sm font-medium text-medium-emphasis">{t('PENDING')}</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-high-emphasis">47</h3>
              <p className="text-base font-medium text-high-emphasis">CHF 27,450.00</p>
            </div>
          </div>
          <div className="flex flex-col hover:bg-primary-50 cursor-pointer gap-2 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-error-background">
                <AlertCircle className="h-5 w-5 text-error" />
              </div>
              <span className="text-sm font-medium text-medium-emphasis">{t('OVERDUE')}</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-high-emphasis">4</h3>
              <p className="text-base font-medium text-high-emphasis">CHF 9,914.00</p>
            </div>
          </div>
          <div className="flex flex-col hover:bg-primary-50 cursor-pointer gap-2 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface">
                <FileEdit className="h-5 w-5 text-medium-emphasis" />
              </div>
              <span className="text-sm font-medium text-medium-emphasis">{t('DRAFT')}</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-high-emphasis">3</h3>
              <p className="text-base font-medium text-high-emphasis">CHF 10,000.00</p>
            </div>
          </div>
        </div>
        <Separator />
        <InvoiceTable />
      </CardContent>
    </Card>
  );
}

export default InvoicesOverview;
