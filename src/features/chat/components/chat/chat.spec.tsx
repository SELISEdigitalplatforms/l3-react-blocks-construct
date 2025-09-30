import React from 'react';
import { vi } from 'vitest'
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest'
import '@testing-library/jest-dom';
import { Chat } from './chat';

import { vi } from 'vitest'
vi.mock('../chat-sidebar/chat-sidebar', () => ({
  __esModule: true,
  ChatSidebar: () => <div data-testid="chat-sidebar" />,
}));
vi.mock('../chat-users/chat-users', () => ({
  __esModule: true,
  ChatUsers: () => <div data-testid="chat-users" />,
}));
vi.mock('../chat-search/chat-search', () => ({
  __esModule: true,
  ChatSearch: () => <div data-testid="chat-search" />,
}));
vi.mock('../chat-state-content/chat-state-content', () => ({
  __esModule: true,
  ChatStateContent: () => <div data-testid="chat-state-content" />,
}));
vi.mock('hooks/use-media-query', () => ({
  useIsMobile: vi.fn(() => false),
}));
vi.mock('../../data/chat.data', () => ({
  mockChatContacts: [],
}));

describe('Chat component', () => {
  it('renders without crashing', () => {
    render(<Chat />);
    expect(screen.getByTestId('chat-sidebar')).toBeInTheDocument();
  });
});
