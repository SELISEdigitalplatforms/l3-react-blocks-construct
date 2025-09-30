import React from 'react';
import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest'
import '@testing-library/jest-dom';

// Mock DropdownMenu and related components to always render children
vi.mock('components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock user profile
const mockUserProfile = {
  avatarSrc: '',
  avatarFallback: 'U',
  name: 'User Name',
  status: { isOnline: true },
};
vi.mock('../../data/chat.data', () => ({
  mockUserProfile,
}));

import { ChatSidebar } from './chat-sidebar';

import { vi } from 'vitest'
const contacts = [
  {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    phoneNo: '',
    avatarSrc: '',
    avatarFallback: 'A',
    date: new Date().toISOString(),
    status: {},
    messages: [],
    members: [],
  },
  {
    id: '2',
    name: 'Bob',
    email: 'bob@example.com',
    phoneNo: '',
    avatarSrc: '',
    avatarFallback: 'B',
    date: new Date().toISOString(),
    status: {},
    messages: [],
    members: [],
  },
];

describe('ChatSidebar', () => {
  it('renders sidebar and user profile', () => {
    render(<ChatSidebar contacts={contacts} onEditClick={vi.fn()} onContactSelect={vi.fn()} />);
    expect(screen.getByText('CHAT')).toBeInTheDocument();
    expect(screen.getByText('User Name')).toBeInTheDocument();
  });

  it('renders contacts', () => {
    render(<ChatSidebar contacts={contacts} onEditClick={vi.fn()} onContactSelect={vi.fn()} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('filters contacts by search', () => {
    render(<ChatSidebar contacts={contacts} onEditClick={vi.fn()} onContactSelect={vi.fn()} />);
    const input = screen.getByPlaceholderText('SEARCH');
    fireEvent.change(input, { target: { value: 'Bob' } });
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('calls onEditClick when edit button is clicked', () => {
    const onEditClick = vi.fn();
    render(
      <ChatSidebar contacts={contacts} onEditClick={onEditClick} onContactSelect={vi.fn()} />
    );
    fireEvent.click(screen.getByTestId('edit-btn'));
    expect(onEditClick).toHaveBeenCalled();
  });

  it('calls onContactSelect when a contact is clicked', () => {
    const onContactSelect = vi.fn();
    render(
      <ChatSidebar contacts={contacts} onEditClick={vi.fn()} onContactSelect={onContactSelect} />
    );
    // Click Alice's contact item using data-testid
    fireEvent.click(screen.getByTestId('chat-contact-item-btn-1'));
    expect(onContactSelect).toHaveBeenCalled();
  });

  it('calls onDiscardClick when discard is clicked in search mode', () => {
    const onDiscardClick = vi.fn();
    render(
      <ChatSidebar
        contacts={contacts}
        onEditClick={vi.fn()}
        onContactSelect={vi.fn()}
        isSearchActive
        onDiscardClick={onDiscardClick}
      />
    );
    fireEvent.click(screen.getByTestId('edit-btn'));
    // Discard button is always present due to the mock
    fireEvent.click(screen.getByTestId('discard-btn'));
    expect(onDiscardClick).toHaveBeenCalled();
  });

  it('shows NOTHING_FOUND when no contacts match', () => {
    render(<ChatSidebar contacts={contacts} onEditClick={vi.fn()} onContactSelect={vi.fn()} />);
    const input = screen.getByPlaceholderText('SEARCH');
    fireEvent.change(input, { target: { value: 'Nonexistent' } });
    expect(screen.getByText('NOTHING_FOUND')).toBeInTheDocument();
  });
});
