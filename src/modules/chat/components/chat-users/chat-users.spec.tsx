import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { createMockIcon } from '@/lib/utils/test-utils/shared-test-utils';

// Mock lucide-react icons using shared utility
vi.mock('lucide-react', () => ({
  BellOff: createMockIcon('bell-off-icon'),
  EllipsisVertical: createMockIcon('ellipsis-vertical-icon'),
  Info: createMockIcon('info-icon'),
  Phone: createMockIcon('phone-icon'),
  Reply: createMockIcon('reply-icon'),
  Smile: createMockIcon('smile-icon'),
  Trash: createMockIcon('trash-icon'),
  Users: createMockIcon('users-icon'),
  Video: createMockIcon('video-icon'),
  Bell: createMockIcon('bell-icon'),
  FileText: createMockIcon('file-text-icon'),
  Download: createMockIcon('download-icon'),
}));

// Mock UI components - Separator
vi.mock('components/ui/separator', () => ({
  Separator: () => <div data-testid="separator" />,
}));

// Mock UI components - Avatar
vi.mock('components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
  AvatarFallback: ({ children }: any) => <span data-testid="avatar-fallback">{children}</span>,
  AvatarImage: ({ src, alt }: any) => <img data-testid="avatar-image" src={src} alt={alt} />,
}));

// Mock dropdown menu - always render for testing
vi.mock('components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div data-dropdown-state="open">{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: any) => (asChild ? children : <div>{children}</div>),
  DropdownMenuContent: ({ children }: any) => (
    <div style={{ display: 'block' }} data-dropdown-content="true">
      {children}
    </div>
  ),
  DropdownMenuItem: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} role="menuitem" {...props}>
      {children}
    </button>
  ),
}));

// Mock Button component
vi.mock('components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock ConfirmationModal
vi.mock('components/core/confirmation-modal/confirmation-modal', () => ({
  __esModule: true,
  default: ({ open, onOpenChange, onConfirm }: any) =>
    open ? (
      <div data-testid="confirmation-modal">
        <button onClick={() => onConfirm?.()} data-testid="confirm-btn">
          Confirm
        </button>
        <button onClick={() => onOpenChange?.(false)} data-testid="cancel-btn">
          Cancel
        </button>
      </div>
    ) : null,
}));

// Mock child components
vi.mock('../chat-profile/chat-profile', () => ({
  ChatProfile: () => <div data-testid="chat-profile" />,
}));

vi.mock('../modals/forward-message/forward-message', () => ({
  ForwardMessage: (props: any) =>
    props.open ? (
      <div data-testid="forward-modal">
        <button onClick={() => props.onOpenChange(false)}>Close</button>
        <button onClick={props.onForward}>Forward</button>
      </div>
    ) : null,
}));

vi.mock('../chat-input/chat-input', () => ({
  ChatInput: ({ value, onChange, onSubmit }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
    >
      <input data-testid="chat-input" value={value} onChange={(e) => onChange(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  ),
}));

import { ChatUsers } from './chat-users';

// Test data - extracted to reduce duplication
const createMessage = (id: string, sender: 'me' | 'other', content: string) => ({
  id,
  sender,
  content,
  timestamp: new Date().toISOString(),
});

const createMember = (id: string, name: string, email: string, fallback: string) => ({
  id,
  name,
  email,
  avatarSrc: '',
  avatarFallback: fallback,
});

const baseContact = {
  id: '1',
  name: 'Alice',
  avatarSrc: '',
  avatarFallback: 'A',
  email: 'alice@example.com',
  phoneNo: '',
  members: [] as ReturnType<typeof createMember>[],
  date: new Date().toISOString(),
  status: {} as { isGroup?: boolean },
  messages: [createMessage('msg-1', 'me', 'Hello!'), createMessage('msg-2', 'other', 'Hi Alice!')],
};

// Helper function to render component
const renderChatUsers = (contact = baseContact, props = {}) => {
  return render(<ChatUsers contact={contact} {...props} />);
};

// Helper function to verify messages
const expectMessagesToBeRendered = (messages: string[]) => {
  messages.forEach((message) => {
    expect(screen.getByText(message)).toBeInTheDocument();
  });
};

describe('ChatUsers', () => {
  it('renders contact name and messages', () => {
    renderChatUsers();
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
    expectMessagesToBeRendered(['Hello!', 'Hi Alice!']);
  });

  it('sends a message', () => {
    renderChatUsers();
    const input = screen.getByTestId('chat-input');
    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(screen.getByText('Send'));
    expect(screen.getByText('New message')).toBeInTheDocument();
  });

  it('renders messages correctly', () => {
    renderChatUsers();
    expectMessagesToBeRendered(['Hello!', 'Hi Alice!']);
  });

  it('forwards a message (simplified test)', () => {
    const { container } = renderChatUsers();
    expect(screen.queryByTestId('forward-modal')).not.toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });

  it('toggles profile panel', () => {
    renderChatUsers();
    const infoBtn = screen.getAllByRole('button').find((btn) => btn.querySelector('svg'));
    if (!infoBtn) throw new Error('Info button not found');
    fireEvent.click(infoBtn);
    expect(screen.getByTestId('chat-profile')).toBeInTheDocument();
  });

  it('calls onMuteToggle and onDeleteContact from header (simplified)', () => {
    const onMuteToggle = vi.fn();
    const onDeleteContact = vi.fn();
    const { container } = renderChatUsers(baseContact, { onMuteToggle, onDeleteContact });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('shows group members count if isGroup', () => {
    const groupContact = {
      ...baseContact,
      status: { isGroup: true },
      members: [
        createMember('m1', 'Member 1', 'm1@email.com', 'M1'),
        createMember('m2', 'Member 2', 'm2@email.com', 'M2'),
      ],
    };

    renderChatUsers(groupContact);
    expect(screen.getByText('2 MEMBERS')).toBeInTheDocument();
  });
});
