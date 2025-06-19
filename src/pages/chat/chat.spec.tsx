import { render, screen } from '@testing-library/react';
import { ChatPage } from './chat';
import { Chat } from 'features/chat';

jest.mock('features/chat', () => ({
  Chat: jest.fn(() => <div data-testid="mock-chat" />),
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
