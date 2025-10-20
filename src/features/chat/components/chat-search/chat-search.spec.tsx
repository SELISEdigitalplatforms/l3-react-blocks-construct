import { vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@/test-utils/shared-test-utils';

import { ChatSearch } from './chat-search';

// Mock chat services to match component import path
vi.mock('../../services/chat.services', () => ({
  mockChatContacts: [
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
  ],
}));

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
    const onSelectContact = vi.fn();
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
    const onClose = vi.fn();
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
