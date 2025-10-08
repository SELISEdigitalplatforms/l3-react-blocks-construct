import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Dialog and related UI components
vi.mock('components/ui/dialog', () => ({
  Dialog: ({ open, children }: any) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('components/ui/button', () => ({
  Button: ({ children, disabled, onClick, ...props }: any) => (
    <button disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock('components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

vi.mock('components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarImage: (props: any) => <img {...props} alt="profile" />,
  AvatarFallback: (props: any) => <span {...props} />,
}));

import { ForwardMessage } from './forward-message';

const mockMessage = {
  senderName: 'Alice',
  avatarSrc: 'avatar.png',
  timestamp: new Date('2023-01-01T12:00:00Z').toISOString(),
  content: 'Hello world!',
  attachment: {
    name: 'file.txt',
    type: 'text/plain',
    size: 123,
    url: 'file.txt',
  },
};

describe('ForwardMessage', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    message: mockMessage,
    onForward: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dialog with message details', () => {
    render(<ForwardMessage {...defaultProps} />);
    expect(screen.getByText('FORWARD_THIS_MESSAGE')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
    expect(screen.getByText('file.txt')).toBeInTheDocument();
    expect(screen.getByText('CANCEL')).toBeInTheDocument();
    expect(screen.getByText('FORWARD')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when cancel is clicked', () => {
    render(<ForwardMessage {...defaultProps} />);
    fireEvent.click(screen.getByText('CANCEL'));
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onForward with recipient and note, then closes dialog', () => {
    render(<ForwardMessage {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('ENTER_NAME_EMAIL_GROUP'), {
      target: { value: 'Bob' },
    });
    fireEvent.change(screen.getByPlaceholderText('WRITE_MESSAGE_HERE_OPTIONAL'), {
      target: { value: 'A note' },
    });
    fireEvent.click(screen.getByText('FORWARD'));
    expect(defaultProps.onForward).toHaveBeenCalledWith('Bob', 'A note', mockMessage);
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('disables forward button if recipient is empty', () => {
    render(<ForwardMessage {...defaultProps} />);
    const forwardBtn = screen.getByText('FORWARD');
    expect(forwardBtn).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText('ENTER_NAME_EMAIL_GROUP'), {
      target: { value: 'Bob' },
    });
    expect(forwardBtn).not.toBeDisabled();
  });

  it('does not render dialog when open is false', () => {
    render(<ForwardMessage {...defaultProps} open={false} />);
    expect(screen.queryByText('FORWARD_THIS_MESSAGE')).not.toBeInTheDocument();
  });

  it('renders image attachment if type is image', () => {
    const imageMessage = {
      ...mockMessage,
      attachment: {
        name: 'pic.png',
        type: 'image/png',
        size: 123,
        url: 'pic.png',
      },
    };
    render(<ForwardMessage {...defaultProps} message={imageMessage} />);
    expect(screen.getByAltText('pic.png')).toBeInTheDocument();
  });
});
