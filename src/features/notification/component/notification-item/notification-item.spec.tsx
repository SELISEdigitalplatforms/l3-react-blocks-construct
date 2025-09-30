import React from 'react';
import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationItem } from './notification-item';
// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock mutation hook
const mutateMock = vi.fn();
vi.mock('../../hooks/use-notification', () => ({
  useMarkNotificationAsRead: () => ({
    mutate: mutateMock,
    isPending: false,
  }),
}));

// Mock DropdownMenu and Button
vi.mock('components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children, ...props }: any) => (
    <div {...props} data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: any) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({ children, disabled, onClick, ...props }: any) => (
    <div 
      role="menuitem" 
      tabIndex={0} 
      onClick={disabled ? undefined : onClick}
      data-disabled={disabled}
      {...props}
    >
      {children}
    </div>
  ),
}));

vi.mock('components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
vi.mock('lucide-react', () => ({
  EllipsisVertical: () => <span data-testid="ellipsis-icon" />,
  Loader2: () => <span data-testid="loader-icon" />,
}));

const mockNotification = {
  id: 'notif-1',
  isRead: false,
  createdTime: new Date().toISOString(),
  denormalizedPayload: JSON.stringify({
    Title: 'Test Type',
    Description: 'Test message',
  }),
};

describe('NotificationItem', () => {
  beforeEach(() => {
    mutateMock.mockClear();
  });

  it('renders notification details', () => {
    render(<NotificationItem notification={mockNotification as any} />);
    expect(screen.getByText('Test Type')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText(/^TODAY, \d{1,2}:\d{2} [AP]M$/)).toBeInTheDocument();
  });

  it('calls markAsRead with notification id and onError callback when menu item is clicked', () => {
    render(<NotificationItem notification={mockNotification as any} />);
    // Open the menu (simulate hover)
    fireEvent.mouseOver(screen.getByText('Test Type'));
    // Click the menu trigger to show menu
    fireEvent.click(screen.getByTestId('ellipsis-icon'));
    // Click the Mark as Read menu item
    fireEvent.click(screen.getByText('MARKED_AS_READ'));
    expect(mutateMock).toHaveBeenCalledWith(
      'notif-1',
      expect.objectContaining({
        onError: expect.any(Function),
      })
    );
  });

  it('disables mark as read if already read', () => {
    render(<NotificationItem notification={{ ...mockNotification, isRead: true } as any} />);
    expect(screen.getByText('Test Type')).toBeInTheDocument();
    // The menu item should be disabled (role="menuitem" and disabled prop)
    expect(screen.getByText('MARKED_AS_READ').closest('div')).toHaveAttribute('disabled');
  });
});
