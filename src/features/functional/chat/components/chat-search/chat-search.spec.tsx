import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock data
const mockContacts = [
  {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    avatarSrc: '',
    avatarFallback: 'A',
    phoneNo: '',
    members: [],
    date: new Date().toISOString(),
    status: {},
    messages: [],
  },
  {
    id: '2',
    name: 'Bob',
    email: 'bob@example.com',
    avatarSrc: '',
    avatarFallback: 'B',
    phoneNo: '',
    members: [],
    date: new Date().toISOString(),
    status: {},
    messages: [],
  },
];

jest.mock('../../data/chat.data', () => ({
  mockChatContacts: mockContacts,
}));

import { ChatSearch } from './chat-search';

describe('ChatSearch', () => {
  it('renders input and label', () => {
    render(<ChatSearch />);
    expect(screen.getByLabelText('LABEL_TO:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ENTER_NAME_EMAIL_GROUP')).toBeInTheDocument();
  });

  it('filters contacts by name', () => {
    render(<ChatSearch />);
    const input = screen.getByPlaceholderText('ENTER_NAME_EMAIL_GROUP');
    fireEvent.change(input, { target: { value: 'Bob' } });
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('filters contacts by email', () => {
    render(<ChatSearch />);
    const input = screen.getByPlaceholderText('ENTER_NAME_EMAIL_GROUP');
    fireEvent.change(input, { target: { value: 'alice@example.com' } });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('calls onSelectContact when a contact is clicked', () => {
    const onSelectContact = jest.fn();
    render(<ChatSearch onSelectContact={onSelectContact} />);
    const input = screen.getByPlaceholderText('ENTER_NAME_EMAIL_GROUP');
    fireEvent.change(input, { target: { value: 'Alice' } });
    // Open dropdown by focusing input
    fireEvent.focus(input);
    // Click Alice
    fireEvent.mouseDown(screen.getByText('Alice'));
    expect(onSelectContact).toHaveBeenCalledWith(expect.objectContaining({ name: 'Alice' }));
  });

  it('removes a selected user', () => {
    render(<ChatSearch />);
    const input = screen.getByPlaceholderText('ENTER_NAME_EMAIL_GROUP');
    fireEvent.change(input, { target: { value: 'Alice' } });
    fireEvent.focus(input);
    fireEvent.mouseDown(screen.getByText('Alice'));
    // Now Alice should be selected
    expect(screen.getByText('Alice')).toBeInTheDocument();
    // Remove Alice
    fireEvent.click(screen.getByRole('button', { name: '' })); // The X button
    // Alice should be removed from selected users chip
    const chip = screen.queryByText('Alice', { selector: '.text-xs.text-medium-emphasis' });
    expect(chip).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<ChatSearch onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: '' })); // The close X button
    expect(onClose).toHaveBeenCalled();
  });

  it('shows "No contacts found" when search yields nothing', () => {
    render(<ChatSearch />);
    const input = screen.getByPlaceholderText('ENTER_NAME_EMAIL_GROUP');
    fireEvent.change(input, { target: { value: 'Nonexistent' } });
    expect(screen.getByText('No contacts found')).toBeInTheDocument();
  });
});
