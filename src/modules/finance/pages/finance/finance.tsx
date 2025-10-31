import {
  FinanceDashboardHeader,
  FinanceOverview,
  FinanceProfitOverviewGraph,
  FinanceRevenueExpenseGraph,
  FinanceInvoices,
} from '@/modules/finance';

export const FinancePage = () => {
  return (
    <div className="flex w-full flex-col">
      <FinanceDashboardHeader />
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
};
