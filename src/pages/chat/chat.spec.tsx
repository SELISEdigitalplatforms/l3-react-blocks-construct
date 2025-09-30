import { render, screen } from '@testing-library/react';
import { vi } from 'vitest'
import { ChatPage } from './chat';
import { vi } from 'vitest'
import { Chat } from '@/features/chat';

import { vi } from 'vitest'
vi.mock('features/chat', () => ({
  Chat: vi.fn(() => <div data-testid="mock-chat" />),
}));

describe('ChatPage', () => {
  test('renders without crashing', () => {
    render(<ChatPage />);
  });

  test('renders a div with full width and height classes', () => {
    const { container } = render(<ChatPage />);
    const outerDiv = container.firstChild;

    expect(outerDiv).toHaveClass('h-full');
    expect(outerDiv).toHaveClass('w-full');
  });

  test('renders the Chat component', () => {
    render(<ChatPage />);

    const chatComponent = screen.getByTestId('mock-chat');
    expect(chatComponent).toBeInTheDocument();

    expect(Chat).toHaveBeenCalledWith({}, {});
  });
});
