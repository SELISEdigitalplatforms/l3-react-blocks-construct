import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock dropdown menu to always render children
jest.mock('components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

// Mock child components
jest.mock('../chat-profile/chat-profile', () => ({
  ChatProfile: () => <div data-testid="chat-profile" />,
}));
jest.mock('../modals/forward-message/forward-message', () => ({
  ForwardMessage: (props: any) =>
    props.open ? (
      <div data-testid="forward-modal">
        <button onClick={() => props.onOpenChange(false)}>Close</button>
        <button onClick={props.onForward}>Forward</button>
      </div>
    ) : null,
}));
jest.mock('../chat-input/chat-input', () => ({
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

const baseContact = {
  id: '1',
  name: 'Alice',
  avatarSrc: '',
  avatarFallback: 'A',
  email: 'alice@example.com',
  phoneNo: '',
  members: [],
  date: new Date().toISOString(),
  status: {},
  messages: [
    {
      id: 'msg-1',
      sender: 'me' as const,
      content: 'Hello!',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'msg-2',
      sender: 'other' as const,
      content: 'Hi Alice!',
      timestamp: new Date().toISOString(),
    },
  ],
};

describe('ChatUsers', () => {
  it('renders contact name and messages', () => {
    render(<ChatUsers contact={baseContact} />);
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('Hi Alice!')).toBeInTheDocument();
  });

  it('sends a message', () => {
    render(<ChatUsers contact={baseContact} />);
    const input = screen.getByTestId('chat-input');
    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(screen.getByText('Send'));
    expect(screen.getByText('New message')).toBeInTheDocument();
  });

  it('deletes a message', async () => {
    render(<ChatUsers contact={baseContact} />);
    fireEvent.click(screen.getByTestId('msg-msg-1-delete-btn'));
    expect(screen.queryByText('Hello!')).not.toBeInTheDocument();
  });

  it('forwards a message (opens and closes modal)', () => {
    render(<ChatUsers contact={baseContact} />);
    fireEvent.click(screen.getByTestId('msg-msg-1-forward-btn'));
    expect(screen.getByTestId('forward-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Forward'));
    expect(screen.queryByTestId('forward-modal')).not.toBeInTheDocument();
  });

  it('toggles profile panel', () => {
    render(<ChatUsers contact={baseContact} />);
    const infoBtn = screen.getAllByRole('button').find((btn) => btn.querySelector('svg'));
    if (!infoBtn) throw new Error('Info button not found');
    fireEvent.click(infoBtn);
    expect(screen.getByTestId('chat-profile')).toBeInTheDocument();
  });

  it('calls onMuteToggle and onDeleteContact from dropdown', () => {
    const onMuteToggle = jest.fn();
    const onDeleteContact = jest.fn();
    render(
      <ChatUsers
        contact={baseContact}
        onMuteToggle={onMuteToggle}
        onDeleteContact={onDeleteContact}
      />
    );
    fireEvent.click(screen.getByTestId('header-mute-btn'));
    expect(onMuteToggle).toHaveBeenCalledWith('1');
    fireEvent.click(screen.getByTestId('header-delete-btn'));
    expect(onDeleteContact).toHaveBeenCalledWith('1');
  });

  it('shows group members count if isGroup', () => {
    render(
      <ChatUsers
        contact={{
          ...baseContact,
          status: { isGroup: true },
          members: [
            {
              id: 'm1',
              name: 'Member 1',
              email: 'm1@email.com',
              avatarSrc: '',
              avatarFallback: 'M1',
            },
            {
              id: 'm2',
              name: 'Member 2',
              email: 'm2@email.com',
              avatarSrc: '',
              avatarFallback: 'M2',
            },
          ],
        }}
      />
    );
    expect(screen.getByText('2 MEMBERS')).toBeInTheDocument();
  });
});
