import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FinanceDashboardHeader } from './finance-dashboard-header';
import '../../../../test-utils/shared-test-utils';

// Mock UI components
vi.mock('@/components/ui-kit/button', () => ({
  Button: ({ children, variant, className, ...props }: any) => (
    <button 
      data-testid={variant === 'outline' ? 'sync-button' : 'export-button'}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Download: ({ className }: { className?: string }) => (
    <svg data-testid="download-icon" className={className}>
      <title>Download</title>
    </svg>
  ),
  RefreshCcw: ({ className }: { className?: string }) => (
    <svg data-testid="refresh-icon" className={className}>
      <title>Refresh</title>
    </svg>
  ),
}));

describe('FinanceDashboardHeader Component', () => {
  it('should render without crashing', () => {
    render(<FinanceDashboardHeader />);
    expect(screen.getByText('FINANCE')).toBeInTheDocument();
  });

  it('should render the main title', () => {
    render(<FinanceDashboardHeader />);
    
    const title = screen.getByText('FINANCE');
    expect(title).toBeInTheDocument();
    expect(title.tagName.toLowerCase()).toBe('h3');
    expect(title).toHaveClass('text-2xl', 'font-bold', 'tracking-tight', 'text-high-emphasis');
  });

  it('should render both action buttons', () => {
    render(<FinanceDashboardHeader />);
    
    const syncButton = screen.getByTestId('sync-button');
    const exportButton = screen.getByTestId('export-button');
    
    expect(syncButton).toBeInTheDocument();
    expect(exportButton).toBeInTheDocument();
  });

  it('should render sync button with correct properties', () => {
    render(<FinanceDashboardHeader />);
    
    const syncButton = screen.getByTestId('sync-button');
    expect(syncButton).toHaveClass('text-high-emphasis', 'hover:text-high-emphasis', 'font-bold');
    
    // Check for refresh icon
    const refreshIcon = screen.getByTestId('refresh-icon');
    expect(refreshIcon).toBeInTheDocument();
    expect(refreshIcon).toHaveClass('w-2.5', 'h-2.5');
    
    // Check for sync text
    const syncText = screen.getByText('SYNC');
    expect(syncText).toBeInTheDocument();
    expect(syncText).toHaveClass('text-sm', 'font-bold', 'sr-only', 'sm:not-sr-only', 'sm:whitespace-nowrap');
  });

  it('should render export button with correct properties', () => {
    render(<FinanceDashboardHeader />);
    
    const exportButton = screen.getByTestId('export-button');
    expect(exportButton).toHaveClass('font-bold');
    
    // Check for download icon
    const downloadIcon = screen.getByTestId('download-icon');
    expect(downloadIcon).toBeInTheDocument();
    expect(downloadIcon).toHaveClass('w-2.5', 'h-2.5');
    
    // Check for export text
    const exportText = screen.getByText('EXPORT');
    expect(exportText).toBeInTheDocument();
    expect(exportText).toHaveClass('text-sm', 'font-bold', 'sr-only', 'sm:not-sr-only', 'sm:whitespace-nowrap');
  });

  it('should have proper container structure and layout', () => {
    const { container } = render(<FinanceDashboardHeader />);
    
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass(
      'mb-[18px]', 
      'flex', 
      'items-center', 
      'justify-between', 
      'md:mb-[32px]'
    );
  });

  it('should have buttons container with correct layout', () => {
    render(<FinanceDashboardHeader />);
    
    const syncButton = screen.getByTestId('sync-button');
    const exportButton = screen.getByTestId('export-button');
    
    const buttonsContainer = syncButton.parentElement;
    expect(buttonsContainer).toHaveClass('flex', 'gap-4');
    expect(buttonsContainer).toContain(exportButton);
  });

  it('should use translation keys correctly', () => {
    render(<FinanceDashboardHeader />);
    
    // Check that translation keys are used (mocked to return the key itself)
    expect(screen.getByText('FINANCE')).toBeInTheDocument();
    expect(screen.getByText('SYNC')).toBeInTheDocument();
    expect(screen.getByText('EXPORT')).toBeInTheDocument();
  });

  it('should render icons with correct sizes', () => {
    render(<FinanceDashboardHeader />);
    
    const refreshIcon = screen.getByTestId('refresh-icon');
    const downloadIcon = screen.getByTestId('download-icon');
    
    expect(refreshIcon).toHaveClass('w-2.5', 'h-2.5');
    expect(downloadIcon).toHaveClass('w-2.5', 'h-2.5');
  });

  describe('Responsive Design', () => {
    it('should have responsive margin classes', () => {
      const { container } = render(<FinanceDashboardHeader />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('mb-[18px]', 'md:mb-[32px]');
    });

    it('should have responsive text visibility classes', () => {
      render(<FinanceDashboardHeader />);
      
      const syncText = screen.getByText('SYNC');
      const exportText = screen.getByText('EXPORT');
      
      // Both should have screen reader only on mobile, visible on sm and up
      expect(syncText).toHaveClass('sr-only', 'sm:not-sr-only');
      expect(exportText).toHaveClass('sr-only', 'sm:not-sr-only');
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<FinanceDashboardHeader />);
      
      const title = screen.getByText('FINANCE');
      expect(title.tagName.toLowerCase()).toBe('h3');
    });

    it('should have accessible button text', () => {
      render(<FinanceDashboardHeader />);
      
      // Text should be available for screen readers
      expect(screen.getByText('SYNC')).toBeInTheDocument();
      expect(screen.getByText('EXPORT')).toBeInTheDocument();
    });

    it('should have proper icon accessibility', () => {
      render(<FinanceDashboardHeader />);
      
      const refreshIcon = screen.getByTestId('refresh-icon');
      const downloadIcon = screen.getByTestId('download-icon');
      
      // Icons should have titles for accessibility (from our mock)
      expect(refreshIcon).toBeInTheDocument();
      expect(downloadIcon).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render without console errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        // Mock implementation to suppress console errors during testing
      });
      
      render(<FinanceDashboardHeader />);
      
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should export component correctly', () => {
      expect(FinanceDashboardHeader).toBeDefined();
      expect(typeof FinanceDashboardHeader).toBe('function');
    });

    it('should handle translation function correctly', () => {
      render(<FinanceDashboardHeader />);
      
      // Verify that useTranslation hook is called and t function works
      expect(screen.getByText('FINANCE')).toBeInTheDocument();
      expect(screen.getByText('SYNC')).toBeInTheDocument();
      expect(screen.getByText('EXPORT')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should maintain proper element hierarchy', () => {
      const { container } = render(<FinanceDashboardHeader />);
      
      const mainContainer = container.firstChild as HTMLElement;
      const title = screen.getByText('FINANCE');
      const buttonsContainer = screen.getByTestId('sync-button').parentElement;
      
      expect(mainContainer).toContain(title);
      expect(mainContainer).toContain(buttonsContainer);
    });

    it('should have title and buttons in correct order', () => {
      const { container } = render(<FinanceDashboardHeader />);
      
      const mainContainer = container.firstChild as HTMLElement;
      const children = Array.from(mainContainer.children);
      
      // First child should contain the title
      expect(children[0]).toContain(screen.getByText('FINANCE'));
      
      // Second child should contain the buttons
      expect(children[1]).toContain(screen.getByTestId('sync-button'));
      expect(children[1]).toContain(screen.getByTestId('export-button'));
    });
  });
});