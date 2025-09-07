import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock image import
jest.mock('assets/images/chat.svg', () => 'chat.svg');

import { ChatStateContent } from './chat-state-content';

describe('ChatStateContent', () => {
  it('renders default state (not search active)', () => {
    render(<ChatStateContent />);
    expect(screen.getByAltText('chat svg')).toBeInTheDocument();
    expect(screen.getByText('SELECT_CONVERSATION')).toBeInTheDocument();
    expect(screen.getByText('START_NEW_ONE_BEGIN_CHATTING')).toBeInTheDocument();
    // Button should not be present by default
    expect(screen.queryByText('START_NEW_CONVERSATION')).not.toBeInTheDocument();
  });

  it('renders search active state', () => {
    render(<ChatStateContent isSearchActive />);
    expect(screen.getByText('LET_GET_CHAT_STARTED')).toBeInTheDocument();
    expect(screen.getByText('SELECT_PARTICIPANTS_YOUR_CONVERSATION')).toBeInTheDocument();
    // Button should not be present in search active state
    expect(screen.queryByText('START_NEW_CONVERSATION')).not.toBeInTheDocument();
  });

  it('renders and handles start new conversation button', () => {
    const handleStart = jest.fn();
    render(<ChatStateContent onStartNewConversation={handleStart} />);
    const btn = screen.getByText('START_NEW_CONVERSATION');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleStart).toHaveBeenCalled();
  });

  it('does not render start new conversation button if isSearchActive', () => {
    const handleStart = jest.fn();
    render(<ChatStateContent isSearchActive onStartNewConversation={handleStart} />);
    expect(screen.queryByText('START_NEW_CONVERSATION')).not.toBeInTheDocument();
  });
});
