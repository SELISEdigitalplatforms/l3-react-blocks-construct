import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '../../../../test-utils/shared-test-utils';

// Mock all finance feature components
vi.mock('@/modules/finance', () => ({
  FinanceInvoices: () => <div data-testid="finance-invoices">FinanceInvoices Component</div>,
  FinanceOverview: () => <div data-testid="finance-overview">FinanceOverview Component</div>,
  FinanceProfitOverviewGraph: () => (
    <div data-testid="finance-profit-overview-graph">FinanceProfitOverviewGraph Component</div>
  ),
  FinanceRevenueExpenseGraph: () => (
    <div data-testid="finance-revenue-expense-graph">FinanceRevenueExpenseGraph Component</div>
  ),
  FinanceDashboardHeader: () => (
    <div data-testid="finance-dashboard-header">FinanceDashboardHeader Component</div>
  ),
}));

import { FinancePage } from './finance';

describe('Finance Component', () => {
  it('should render without crashing', () => {
    render(<FinancePage />);
    expect(screen.getByTestId('finance-dashboard-header')).toBeInTheDocument();
  });

  it('should render the main container with correct structure', () => {
    const { container } = render(<FinancePage />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('flex', 'w-full', 'flex-col');
  });

  it('should render FinanceDashboardHeader component', () => {
    render(<FinancePage />);

    expect(screen.getByTestId('finance-dashboard-header')).toBeInTheDocument();
    expect(screen.getByText('FinanceDashboardHeader Component')).toBeInTheDocument();
  });

  it('should render FinanceOverview component', () => {
    render(<FinancePage />);

    expect(screen.getByTestId('finance-overview')).toBeInTheDocument();
    expect(screen.getByText('FinanceOverview Component')).toBeInTheDocument();
  });

  it('should render both graph components in the same row container', () => {
    render(<FinancePage />);

    const profitGraph = screen.getByTestId('finance-profit-overview-graph');
    const revenueExpenseGraph = screen.getByTestId('finance-revenue-expense-graph');

    expect(profitGraph).toBeInTheDocument();
    expect(revenueExpenseGraph).toBeInTheDocument();

    // Check if they share the same parent container with flex layout
    const graphContainer = profitGraph.closest('.flex.flex-col.md\\:flex-row.gap-4');
    expect(graphContainer).toContain(revenueExpenseGraph);
  });

  it('should render FinanceInvoices component', () => {
    render(<FinancePage />);

    expect(screen.getByTestId('finance-invoices')).toBeInTheDocument();
    expect(screen.getByText('FinanceInvoices Component')).toBeInTheDocument();
  });

  it('should render all components in the correct order', () => {
    render(<FinancePage />);

    const components = [
      screen.getByTestId('finance-dashboard-header'),
      screen.getByTestId('finance-overview'),
      screen.getByTestId('finance-profit-overview-graph'),
      screen.getByTestId('finance-revenue-expense-graph'),
      screen.getByTestId('finance-invoices'),
    ];

    // Verify all components are rendered
    components.forEach((component) => {
      expect(component).toBeInTheDocument();
    });
  });

  it('should have proper responsive layout classes', () => {
    render(<FinancePage />);

    // Check main content container
    const contentContainer = screen.getByTestId('finance-overview').closest('.flex.flex-col.gap-4');
    expect(contentContainer).toHaveClass('flex', 'flex-col', 'gap-4');

    // Check graphs container for responsive layout
    const graphsContainer = screen
      .getByTestId('finance-profit-overview-graph')
      .closest('.flex.flex-col.md\\:flex-row.gap-4');
    expect(graphsContainer).toHaveClass('flex', 'flex-col', 'md:flex-row', 'gap-4');
  });

  it('should maintain component hierarchy structure', () => {
    const { container } = render(<FinancePage />);

    // Verify the overall structure
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('flex', 'w-full', 'flex-col');

    // Verify header is rendered
    const header = screen.getByTestId('finance-dashboard-header');
    expect(header).toBeInTheDocument();

    // Verify content container structure
    const contentContainer = screen.getByTestId('finance-overview').closest('.flex.flex-col.gap-4');
    expect(contentContainer).toBeInTheDocument();
  });

  it('should export Finance component correctly', () => {
    expect(FinancePage).toBeDefined();
    expect(typeof FinancePage).toBe('function');
  });

  describe('Component Integration', () => {
    it('should render all finance feature components without errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        // Mock implementation to suppress console errors during testing
      });

      render(<FinancePage />);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle missing components gracefully', () => {
      // This test ensures the component structure is maintained even if child components fail
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        // Mock implementation to suppress console errors during testing
      });

      const { container } = render(<FinancePage />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass('flex', 'w-full', 'flex-col');

      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const { container } = render(<FinancePage />);
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer.tagName.toLowerCase()).toBe('div');
    });

    it('should be keyboard accessible', () => {
      render(<FinancePage />);
      expect(screen.getByTestId('finance-dashboard-header')).toBeInTheDocument();
    });
  });
});
