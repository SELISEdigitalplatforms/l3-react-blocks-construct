import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Clock, CheckCircle, AlertCircle, FileEdit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Separator } from 'components/ui/separator';
import InvoicesDataTable from '../invoices-data-table/invoices-data-table';
import { invoiceData } from '../../data/invoice-data';
import { createInvoicesTableColumns } from '../invoices-table-column/invoices-table-column';
import { Table as TableInstance, ColumnFiltersState } from '@tanstack/react-table';
import { Invoice } from '../../data/invoice-data'; // Assuming correct path

interface InvoicesOverviewProps {
  onColumnFiltersChange: (filters: ColumnFiltersState) => void;
  onTableInstanceReady: (table: TableInstance<Invoice>) => void;
}

function InvoicesOverview({
  onTableInstanceReady,
  onColumnFiltersChange,
}: Readonly<InvoicesOverviewProps>) {
  const { t } = useTranslation();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handlePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
    setPagination(newPagination);
  };

  const columns = useMemo(() => createInvoicesTableColumns({ t }), [t]);

  const handleTableReady = (table: TableInstance<Invoice>) => {
    onTableInstanceReady(table);
    // Subscribe to column filters changes
    const initialFilters = table.getState().columnFilters;
    // Use useEffect for subscription in the parent component
    onColumnFiltersChange(initialFilters);
  };

  return (
    <Card className="w-full border-none rounded-[8px] shadow-sm">
      <CardHeader className="!pb-0">
        <CardTitle className="text-xl text-high-emphasis">{t('OVERVIEW')}</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="flex flex-col hover:bg-primary-50 hover:rounded-[4px] cursor-pointer gap-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-medium-emphasis capitalize">
                {t('TOTAL_INVOICES')}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-high-emphasis">120</h3>
              <p className="text-base font-medium text-high-emphasis">CHF 82,564.00</p>
            </div>
          </div>
          <div className="flex flex-col hover:bg-primary-50 hover:rounded-[4px] cursor-pointer gap-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-success-background">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <span className="text-sm font-medium text-medium-emphasis capitalize">
                {t('PAID')}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-high-emphasis">73</h3>
              <p className="text-base font-medium text-high-emphasis">CHF 35,200.00</p>
            </div>
          </div>
          <div className="flex flex-col hover:bg-primary-50 hover:rounded-[4px] cursor-pointer gap-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warning-background">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <span className="text-sm font-medium text-medium-emphasis capitalize">
                {t('PENDING')}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-high-emphasis">47</h3>
              <p className="text-base font-medium text-high-emphasis">CHF 27,450.00</p>
            </div>
          </div>
          <div className="flex flex-col hover:bg-primary-50 hover:rounded-[4px] cursor-pointer gap-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-error-background">
                <AlertCircle className="h-5 w-5 text-error" />
              </div>
              <span className="text-sm font-medium text-medium-emphasis capitalize">
                {t('OVERDUE')}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-high-emphasis">4</h3>
              <p className="text-base font-medium text-high-emphasis">CHF 9,914.00</p>
            </div>
          </div>
          <div className="flex flex-col hover:bg-primary-50 hover:rounded-[4px] cursor-pointer gap-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface">
                <FileEdit className="h-5 w-5 text-medium-emphasis" />
              </div>
              <span className="text-sm font-medium text-medium-emphasis capitalize">
                {t('DRAFT')}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-high-emphasis">3</h3>
              <p className="text-base font-medium text-high-emphasis">CHF 10,000.00</p>
            </div>
          </div>
        </div>
        <Separator />
        <InvoicesDataTable
          columns={columns}
          data={invoiceData}
          pagination={{
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            totalCount: invoiceData.length,
          }}
          onPaginationChange={handlePaginationChange}
          manualPagination={false}
          onTableInstanceReady={handleTableReady}
        />
      </CardContent>
    </Card>
  );
}

export { InvoicesOverview };
