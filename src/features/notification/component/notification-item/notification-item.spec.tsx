import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationItem } from './notification-item';

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock mutation hook
const mutateMock = jest.fn();
jest.mock('../../hooks/use-notification', () => ({
  useMarkNotificationAsRead: () => ({
    mutate: mutateMock,
    isPending: false,
  }),
}));

// Mock DropdownMenu and Button
jest.mock('components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, ...props }: any) => (
    <div role="menuitem" tabIndex={0} {...props}>
      {children}
    </div>
  ),
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
jest.mock('lucide-react', () => ({
  EllipsisVertical: () => <span data-testid="ellipsis-icon" />,
  Loader2: () => <span data-testid="loader-icon" />,
}));

const mockNotification = {
  id: 'notif-1',
  isRead: false,
  createdTime: new Date().toISOString(),
  payload: {
    notificationType: 'Test Type',
    responseValue: 'Test message',
  },
};

describe('NotificationItem', () => {
  beforeEach(() => {
    mutateMock.mockClear();
  });

  it('renders notification details', () => {
    render(<NotificationItem notification={mockNotification as any} />);
    expect(screen.getByText('Test Type')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText(/^TODAY, \d{2}:\d{2}$/)).toBeInTheDocument();
  });

  it('calls markAsRead with notification id and onError callback when menu item is clicked', () => {
    render(<NotificationItem notification={mockNotification as any} />);
    // Open the menu (simulate hover)
    fireEvent.mouseOver(screen.getByText('Test Type'));
    // Click the menu trigger to show menu
    fireEvent.click(screen.getByTestId('ellipsis-icon'));
    // Click the Mark as Read menu item
    fireEvent.click(screen.getByText('MARK_AS_READ'));
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
    expect(screen.getByText('MARK_AS_READ').closest('div')).toHaveAttribute('disabled');
  });
});
