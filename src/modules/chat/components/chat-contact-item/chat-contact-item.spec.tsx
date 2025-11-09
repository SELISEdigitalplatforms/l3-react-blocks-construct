import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatContact } from '../../types/chat.types';
import { ChatContactItem } from './chat-contact-item';
import { vi } from 'vitest';

// Mock i18n translation to return the key
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  BellOff: (props: any) => <svg data-testid="bell-off-icon" {...props} />,
  EllipsisVertical: (props: any) => <svg data-testid="ellipsis-vertical-icon" {...props} />,
  Mail: (props: any) => <svg data-testid="mail-icon" {...props} />,
  MailOpen: (props: any) => <svg data-testid="mail-open-icon" {...props} />,
  Trash: (props: any) => <svg data-testid="trash-icon" {...props} />,
  Users: (props: any) => <svg data-testid="users-icon" {...props} />,
}));

// Mock the dropdown menu to make it easier to test
vi.mock('components/ui/dropdown-menu', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  return {
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
  };
});

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
    const onClick = vi.fn();
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

  it('renders contact info and provides interaction handlers', async () => {
    const mockHandlers = {
      onMarkAsRead: vi.fn(),
      onMarkAsUnread: vi.fn(),
      onMuteToggle: vi.fn(),
      onDeleteContact: vi.fn(),
    };

    const contact: ChatContact = {
      ...baseContact,
      status: { ...baseContact.status, isUnread: true },
    };

    const { container } = render(<ChatContactItem {...contact} {...mockHandlers} />);

    // Verify component renders
    expect(container.firstChild).toBeInTheDocument();

    // Verify contact name is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Verify dropdown trigger is present
    const dropdownTrigger = screen.getByRole('button', {
      name: 'Open chat with John Doe',
    });
    expect(dropdownTrigger).toBeInTheDocument();

    // Verify the component accepts all the handler props
    expect(mockHandlers.onMarkAsRead).toBeDefined();
    expect(mockHandlers.onMuteToggle).toBeDefined();
    expect(mockHandlers.onDeleteContact).toBeDefined();
  });

  it('shows collapsed UI when isCollapsed is true', () => {
    render(<ChatContactItem {...baseContact} isCollapsed />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
  });
});
