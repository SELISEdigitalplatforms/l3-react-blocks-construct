import { useCallback, useState } from 'react';
import { AdvancedTableColumnsToolbar } from 'features/inventory/component/advance-table-columns-toolbar/advance-table-columns-toolbar';
import AdvanceDataTable from 'features/inventory/component/advance-data-table/advance-data-table';
import { createAdvanceTableColumns } from 'features/inventory/component/advance-table-columns/advance-table-columns';
import { inventoryData } from 'features/inventory/services/inventory-service';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export function Inventory() {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: inventoryData.length,
  });

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

  const handleViewDetails = () => {
    console.log('hello handleViewDetails');
  };

  const columns = createAdvanceTableColumns();

  return (
    <div className="flex w-full flex-col">
      <div className="mb-[18px] flex items-center text-base text-high-emphasis md:mb-[24px]">
        <h3 className="text-2xl font-bold tracking-tight">Inventory</h3>
      </div>
      <AdvanceDataTable
        data={inventoryData}
        columns={columns}
        onRowClick={handleViewDetails}
        isLoading={false}
        error={null}
        toolbar={(table) => <AdvancedTableColumnsToolbar table={table} />}
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
