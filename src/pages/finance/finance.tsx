import {
  FinanceInvoices,
  FinanceOverview,
  FinanceProfitOverviewGraph,
  FinanceRevenueExpenseGraph,
  FinanceDashboardHeader,
} from '@/features/finance';

export const Finance = () => {
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
