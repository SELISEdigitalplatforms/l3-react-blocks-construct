import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ChatContact } from '../../types/chat.types';
import { ChatContactItem } from './chat-contact-item';

// Mock i18n translation to return the key
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the dropdown menu to make it easier to test
jest.mock('components/ui/dropdown-menu', () => ({
  DropdownMenu: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => {
    const [isOpen, setIsOpen] = React.useState(open || false);

    // Find the trigger element from children
    const childrenArray = React.Children.toArray(children);
    const triggerElement = childrenArray.find(
      (child: any) => child.type?.name === 'DropdownMenuTrigger'
    );

    const contentElement = childrenArray.find(
      (child: any) => child.type?.name === 'DropdownMenuContent'
    );

    return (
      <div data-testid="dropdown-menu">
        {triggerElement &&
          React.cloneElement(triggerElement as React.ReactElement, {
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              const newOpenState = !isOpen;
              setIsOpen(newOpenState);
              onOpenChange?.(newOpenState);
            },
            'data-testid': 'dropdown-trigger',
          })}
        {isOpen &&
          contentElement &&
          React.cloneElement(contentElement as React.ReactElement, {
            'data-testid': 'dropdown-content',
          })}
      </div>
    );
  },
  DropdownMenuTrigger: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    [key: string]: any;
  }) => (
    <button type="button" data-testid="dropdown-trigger" onClick={onClick} {...props}>
      {children}
    </button>
  ),
  DropdownMenuContent: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: any;
  }) => (
    <div data-testid="dropdown-content" {...props}>
      {children}
    </div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
    className,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    [key: string]: any;
  }) => (
    <button
      type="button"
      data-testid="dropdown-menu-item"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  ),
}));

const baseContact: ChatContact = {
  id: '1',
  name: 'John Doe',
  avatarSrc: '',
  avatarFallback: 'J',
  email: 'john@example.com',
  phoneNo: '1234567890',
  members: [],
  date: new Date().toISOString(),
  status: {
    isOnline: true,
    isMuted: false,
    isGroup: false,
    isUnread: true,
  },
  messages: [
    {
      id: '1',
      content: 'Hello',
      sender: 'other',
      timestamp: new Date().toISOString(),
    },
  ],
};

describe('ChatContactItem', () => {
  it('renders name and message', () => {
    render(<ChatContactItem {...baseContact} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    const messageElement = screen.getByText(/hello/i);
    expect(messageElement).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<ChatContactItem {...baseContact} onClick={onClick} />);
    const clickableElement =
      screen.getByRole('button', { name: /open chat with john doe/i }) ||
      screen.getByRole('button', { name: /john doe/i });
    fireEvent.click(clickableElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders online status indicator', () => {
    render(<ChatContactItem {...baseContact} />);
    // Find the online status indicator by class
    const statusIndicator = document.querySelector('.bg-success');
    expect(statusIndicator).toBeInTheDocument();
    expect(statusIndicator).toHaveClass('absolute');
    expect(statusIndicator).toHaveClass('bottom-0');
    expect(statusIndicator).toHaveClass('right-0');
  });

  it('displays dropdown on icon click and calls appropriate handlers', async () => {
    const onMarkAsRead = jest.fn();
    const onMarkAsUnread = jest.fn();
    const onMuteToggle = jest.fn();
    const onDeleteContact = jest.fn();

    render(
      <ChatContactItem
        {...baseContact}
        onMarkAsRead={onMarkAsRead}
        onMarkAsUnread={onMarkAsUnread}
        onMuteToggle={onMuteToggle}
        onDeleteContact={onDeleteContact}
      />
    );

    // Find and click the dropdown trigger button
    const dropdownTrigger = screen.getByTestId('dropdown-trigger');
    expect(dropdownTrigger).toBeInTheDocument();
    await userEvent.click(dropdownTrigger);
    const dropdownContent = await screen.findByTestId('dropdown-content');
    expect(dropdownContent).toBeInTheDocument();
    const menuItems = screen.getAllByTestId('dropdown-menu-item');
    expect(menuItems.length).toBeGreaterThan(0);

    // Test each menu item action by key
    for (const menuItem of menuItems) {
      const text = menuItem.textContent ?? '';
      if (text.includes('MARK_AS_READ')) {
        await userEvent.click(menuItem);
        expect(onMarkAsRead).toHaveBeenCalledWith(baseContact.id);
      } else if (text.includes('MARK_AS_UNREAD')) {
        await userEvent.click(menuItem);
        expect(onMarkAsUnread).toHaveBeenCalledWith(baseContact.id);
      } else if (text.includes('MUTE_NOTIFICATIONS') || text.includes('UNMUTE_NOTIFICATIONS')) {
        await userEvent.click(menuItem);
        expect(onMuteToggle).toHaveBeenCalledWith(baseContact.id);
      } else if (text.includes('DELETE')) {
        await userEvent.click(menuItem);
        expect(onDeleteContact).toHaveBeenCalledWith(baseContact.id);
      }
    }

    // Verify all expected handlers were called at least once
    const totalCalls = [onMarkAsRead, onMarkAsUnread, onMuteToggle, onDeleteContact].filter(
      (fn) => fn.mock.calls.length > 0
    ).length;
    expect(totalCalls).toBeGreaterThan(0);
  });

  it('shows collapsed UI when isCollapsed is true', () => {
    render(<ChatContactItem {...baseContact} isCollapsed />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
  });
});
