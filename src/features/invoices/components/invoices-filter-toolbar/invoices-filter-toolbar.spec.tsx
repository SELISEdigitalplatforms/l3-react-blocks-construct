import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InvoicesFilterToolbar } from './invoices-filter-toolbar';

// Mock the InvoicesFilterControls component
jest.mock('../invoices-filter-controls/invoices-filter-controls', () => ({
  InvoicesFilterControls: () => <div data-testid="filter-controls">Filter Controls</div>,
}));

// Mock the react-i18next hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

describe('InvoicesFilterToolbar', () => {
  // Create a mock table for testing
  const mockTable = {
    getColumn: jest.fn().mockImplementation(() => ({
      setFilterValue: jest.fn(),
    })),
    getState: jest.fn().mockReturnValue({
      columnFilters: [],
    }),
    resetColumnFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input and filter controls', () => {
    render(<InvoicesFilterToolbar table={mockTable as any} />);
    
    // Check if search input is rendered
    const searchInput = screen.getByPlaceholderText('SEARCH_CUSTOMER_NAME...');
    expect(searchInput).toBeInTheDocument();
    
    // Check if filter controls component is rendered
    const filterControls = screen.getByTestId('filter-controls');
    expect(filterControls).toBeInTheDocument();
    
    // Reset button should not be visible initially
    const resetButton = screen.queryByText('RESET');
    expect(resetButton).not.toBeInTheDocument();
  });

  test('shows reset button when filters are applied', () => {
    // Mock that filters are applied
    mockTable.getState.mockReturnValue({
      columnFilters: [{ id: 'customerName', value: 'test' }],
    });
    
    render(<InvoicesFilterToolbar table={mockTable as any} />);
    
    // Reset button should be visible
    const resetButton = screen.getByText('RESET');
    expect(resetButton).toBeInTheDocument();
  });

  test('updates search value and sets column filter', () => {
    const setFilterValueMock = jest.fn();
    mockTable.getColumn.mockImplementation((columnId) => {
      if (columnId === 'customerName') {
        return {
          setFilterValue: setFilterValueMock,
        };
      }
      return { setFilterValue: jest.fn() };
    });
    
    render(<InvoicesFilterToolbar table={mockTable as any} />);
    
    // Get the search input and type in it
    const searchInput = screen.getByPlaceholderText('SEARCH_CUSTOMER_NAME...');
    fireEvent.change(searchInput, { target: { value: 'test customer' } });
    
    // Check if the input value is updated
    expect(searchInput).toHaveValue('test customer');
    
    // Check if the column filter was set
    expect(mockTable.getColumn).toHaveBeenCalledWith('customerName');
    expect(setFilterValueMock).toHaveBeenCalledWith('test customer');
  });

  test('resets all filters when reset button is clicked', () => {
    // Mock that filters are applied
    mockTable.getState.mockReturnValue({
      columnFilters: [{ id: 'customerName', value: 'test' }],
    });
    
    render(<InvoicesFilterToolbar table={mockTable as any} />);
    
    // Click the reset button
    const resetButton = screen.getByText('RESET');
    fireEvent.click(resetButton);
    
    // Check if table filters were reset
    expect(mockTable.resetColumnFilters).toHaveBeenCalled();
  });
});
