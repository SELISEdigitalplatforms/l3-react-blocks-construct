import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  InvoicesOverviewTable,
  InvoicesHeaderToolbar,
  createInvoiceTableColumns,
  InvoicesFilterToolbar,
} from 'features/invoices';
import { Invoice, invoiceData } from 'features/invoices/data/invoice-data';
import { Table } from '@tanstack/react-table';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

function InvoicesTableToolbar(table: Readonly<Table<Invoice>>) {
  return <InvoicesFilterToolbar table={table} />;
}

export function InvoicesPage() {
  const { t } = useTranslation();
  const columns = createInvoiceTableColumns({ t });
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Invoice[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(invoiceData);
      setIsLoading(false);
      setPaginationState((prev) => ({
        ...prev,
        totalCount: invoiceData.length,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  /**
   * Handles pagination changes.
   */
  const handlePaginationChange = useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      }));
    },
    []
  );

  const handleInvoicesDetail = (data: Invoice) => {
    navigate(`/invoices/${data.id}`);
  };

  return (
    <div className="flex w-full gap-5 flex-col">
      <InvoicesHeaderToolbar />
      <InvoicesOverviewTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        onRowClick={handleInvoicesDetail}
        toolbar={InvoicesTableToolbar}
        pagination={{
          pageIndex: paginationState.pageIndex,
          pageSize: paginationState.pageSize,
          totalCount: paginationState.totalCount,
        }}
        onPaginationChange={handlePaginationChange}
        manualPagination={false}
      />
    </div>
  );
}
