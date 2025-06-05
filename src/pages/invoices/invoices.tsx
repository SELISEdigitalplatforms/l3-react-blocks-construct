import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InvoicesOverviewTable,
  InvoicesHeaderToolbar,
  createInvoiceTableColumns,
  InvoicesFilterToolbar,
} from 'features/invoices';
import { Invoice, invoiceData } from 'features/invoices/data/invoice-data';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export function Invoices() {
  const { t } = useTranslation();
  const columns = createInvoiceTableColumns({ t });
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Invoice[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(invoiceData);
      setIsLoading(false);
      setPaginationState(prev => ({
        ...prev,
        totalCount: invoiceData.length
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

  return (
    <div className="flex w-full gap-5 flex-col">
      <InvoicesHeaderToolbar />
      <InvoicesOverviewTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        toolbar={(table) => <InvoicesFilterToolbar table={table} />}
        pagination={{
          pageIndex: paginationState.pageIndex, // Current page index
          pageSize: paginationState.pageSize, // Number of rows per page
          totalCount: paginationState.totalCount, // Total number of records
        }}
        onPaginationChange={handlePaginationChange} // Handles page and page size changes
        manualPagination={false} // Using client-side pagination
      />
    </div>
  );
}
