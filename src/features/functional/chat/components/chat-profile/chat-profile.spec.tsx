import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatProfile } from './chat-profile';

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock useToast
jest.mock('hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

// Mock ConfirmationModal and EditGroupName to avoid side effects
jest.mock('components/blocks/confirmation-modal/confirmation-modal', () => ({
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

jest.mock('../modals/edit-group-name/edit-group-name', () => ({
  EditGroupName: ({ isOpen, onClose, onSave }: any) =>
    isOpen ? (
      <div data-testid="edit-group-name-modal">
        <button
          onClick={() => {
            onSave('New Group Name');
            onClose();
          }}
          data-testid="save-btn"
        >
          Save
        </button>
        <button onClick={onClose} data-testid="close-btn">
          Close
        </button>
      </div>
    ) : null,
}));

const baseContact = {
  id: '1',
  name: 'Test User',
  avatarSrc: '',
  avatarFallback: 'T',
  email: 'test@example.com',
  phoneNo: '1234567890',
  members: [],
  date: new Date().toISOString(),
  status: {
    isOnline: true,
    isMuted: false,
    isGroup: false,
    isUnread: false,
  },
  messages: [],
};

const groupContact = {
  ...baseContact,
  name: 'Test Group',
  status: { ...baseContact.status, isGroup: true },
  members: [
    {
      id: 'm1',
      name: 'Member 1',
      email: 'm1@example.com',
      avatarSrc: '',
      avatarFallback: 'M1',
      isMe: false,
    },
    {
      id: 'm2',
      name: 'Me',
      email: 'me@example.com',
      avatarSrc: '',
      avatarFallback: 'ME',
      isMe: true,
    },
  ],
};

describe('ChatProfile', () => {
  it('renders non-group profile info', () => {
    render(<ChatProfile contact={baseContact} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('GENERAL_INFO')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('ATTACHMENTS')).toBeInTheDocument();
  });

  it('renders group profile info and members', () => {
    render(<ChatProfile contact={groupContact} />);
    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('MEMBERS (2)')).toBeInTheDocument();
    expect(screen.getByText('Member 1')).toBeInTheDocument();
    expect(screen.getByText('Me')).toBeInTheDocument();
  });

  it('opens and closes group name edit modal', () => {
    render(<ChatProfile contact={groupContact} />);
    // Open modal
    fireEvent.click(screen.getByTestId('edit-group-name-btn'));
    expect(screen.getByTestId('edit-group-name-modal')).toBeInTheDocument();
    // Save new name
    fireEvent.click(screen.getByTestId('save-btn'));
    // Modal should close after save
    expect(screen.queryByTestId('edit-group-name-modal')).not.toBeInTheDocument();
  });

  it('calls onMuteToggle when mute/unmute button is clicked', () => {
    const onMuteToggle = jest.fn();
    render(<ChatProfile contact={baseContact} onMuteToggle={onMuteToggle} />);
    fireEvent.click(screen.getByText('MUTE'));
    expect(onMuteToggle).toHaveBeenCalledWith(baseContact.id);
  });

  it('calls onDeleteMember when delete button is clicked and confirmed', () => {
    const onDeleteMember = jest.fn();
    render(<ChatProfile contact={groupContact} onDeleteMember={onDeleteMember} />);
    // Click the delete button for Member 1
    fireEvent.click(screen.getByTestId('delete-member-btn-m1'));
    // Modal should appear
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    // Confirm deletion
    fireEvent.click(screen.getByTestId('confirm-btn'));
    expect(onDeleteMember).toHaveBeenCalledWith(groupContact.id, 'm1');
  });

  it('renders attachments', () => {
    render(<ChatProfile contact={baseContact} />);
    expect(screen.getByText('acceptance criteria final.pdf')).toBeInTheDocument();
    expect(screen.getByText('Sunset_View_Image.jpg')).toBeInTheDocument();
    expect(screen.getByText('discussion.mp3')).toBeInTheDocument();
    expect(screen.getByText('meeting_notes.mp4')).toBeInTheDocument();
  });

  it('toggles accordions', () => {
    render(<ChatProfile contact={baseContact} />);
    // Click to open/close the GENERAL_INFO accordion
    const accordionTrigger = screen.getByText('GENERAL_INFO');
    fireEvent.click(accordionTrigger);
    fireEvent.click(accordionTrigger);
    expect(accordionTrigger).toBeInTheDocument();
  });
});
