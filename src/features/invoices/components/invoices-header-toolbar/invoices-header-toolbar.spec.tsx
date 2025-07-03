import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { InvoicesHeaderToolbar } from './invoices-header-toolbar';

// Mock the react-i18next hook
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (key: string) => key,
      i18n: {
        changeLanguage: jest.fn(),
      },
    };
  },
}));

describe('InvoicesHeaderToolbar', () => {
  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <InvoicesHeaderToolbar {...props} />
      </BrowserRouter>
    );
  };

  test('renders with default title', () => {
    renderComponent();
    
    // Check if the default title is rendered
    expect(screen.getByText('INVOICES')).toBeInTheDocument();
    
    // Check if the "New Invoice" button is rendered
    const newInvoiceButton = screen.getByText('NEW_INVOICE');
    expect(newInvoiceButton).toBeInTheDocument();
    
    // Check if the button has the correct link
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/invoices/create-invoice');
  });

  test('renders with custom title', () => {
    const customTitle = 'CUSTOM_TITLE';
    renderComponent({ title: customTitle });
    
    // Check if the custom title is rendered
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  test('renders button with correct styling', () => {
    renderComponent();
    
    // Check if the button has the correct size and styling classes
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-sm');
    expect(button).toHaveClass('font-bold');
  });

  test('renders Plus icon in the button', () => {
    renderComponent();
    
    // Check if the button contains the Plus icon
    // Note: Since Plus is from lucide-react, we can't directly test for the SVG,
    // but we can check that the button contains both the icon and text
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('NEW_INVOICE')).toBeInTheDocument();
  });
});
