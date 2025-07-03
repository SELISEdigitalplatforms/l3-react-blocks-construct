import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Chat } from './chat';

jest.mock('../chat-sidebar/chat-sidebar', () => ({
  __esModule: true,
  ChatSidebar: () => <div data-testid="chat-sidebar" />,
}));
jest.mock('../chat-users/chat-users', () => ({
  __esModule: true,
  ChatUsers: () => <div data-testid="chat-users" />,
}));
jest.mock('../chat-search/chat-search', () => ({
  __esModule: true,
  ChatSearch: () => <div data-testid="chat-search" />,
}));
jest.mock('../chat-state-content/chat-state-content', () => ({
  __esModule: true,
  ChatStateContent: () => <div data-testid="chat-state-content" />,
}));
jest.mock('hooks/use-media-query', () => ({
  useIsMobile: jest.fn(() => false),
}));
jest.mock('../../data/chat.data', () => ({
  mockChatContacts: [],
}));

describe('Chat component', () => {
  it('renders without crashing', () => {
    render(<Chat />);
    expect(screen.getByTestId('chat-sidebar')).toBeInTheDocument();
  });
});
