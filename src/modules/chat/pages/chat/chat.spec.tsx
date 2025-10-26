import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { ChatPage } from './chat';
import '../../../../test-utils/shared-test-utils';

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
});
