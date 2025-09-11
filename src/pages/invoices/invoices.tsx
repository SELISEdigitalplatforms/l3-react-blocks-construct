import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table } from '@tanstack/react-table';
import {
  InvoicesOverviewTable,
  InvoicesHeaderToolbar,
  createInvoiceTableColumns,
  InvoicesFilterToolbar,
} from 'features/invoices';
import { InvoiceItem } from 'features/invoices/types/invoices.types';
import { useGetInvoiceItems } from 'features/invoices/hooks/use-invoices';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

function InvoicesTableToolbar(table: Readonly<Table<InvoiceItem>>) {
  return <InvoicesFilterToolbar table={table} />;
}

export function InvoicesPage() {
  const { t } = useTranslation();
  const columns = createInvoiceTableColumns({ t });
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const {
    data: invoiceDataItems,
    isLoading,
    error,
  } = useGetInvoiceItems({
    pageNo: paginationState.pageIndex + 1,
    pageSize: paginationState.pageSize,
  });

  const invoiceItems = invoiceDataItems?.items ?? [];
  const totalCount = invoiceDataItems?.totalCount ?? 0;

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

  const handleInvoicesDetail = (data: InvoiceItem) => {
    navigate(`/invoices/${data.ItemId}`);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-error">Error loading invoices. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-5 flex-col">
      <InvoicesHeaderToolbar />
      <InvoicesOverviewTable
        data={invoiceItems}
        columns={columns}
        isLoading={isLoading}
        onRowClick={handleInvoicesDetail}
        toolbar={InvoicesTableToolbar}
        pagination={{
          pageIndex: paginationState.pageIndex,
          pageSize: paginationState.pageSize,
          totalCount: totalCount,
        }}
        onPaginationChange={handlePaginationChange}
        manualPagination={true}
      />
    </div>
  );
}
