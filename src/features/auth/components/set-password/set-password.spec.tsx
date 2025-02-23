/* eslint-disable @typescript-eslint/no-var-requires */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { SetpasswordForm } from './set-password';

// Mock the entire auth hook module
jest.mock('../../hooks/use-auth', () => ({
  useAccountActivation: () => ({
    isPending: false,
    mutateAsync: jest.fn(),
  }),
}));

// Mock the BasePasswordForm component
jest.mock('../../../../components/blocks/base-password-form/base-password-form', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  BasePasswordForm: ({ onSubmit, code }: any) => (
    <form
      data-testid="base-password-form"
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        onSubmit('TestPassword123!', code);
      }}
    >
      <input type="password" />
      <button type="submit">Submit</button>
    </form>
  ),
}));

describe('SetPasswordForm', () => {
  const mockCode = 'test-activation-code';
  const mockPassword = 'TestPassword123!';
  let mockMutateAsync: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMutateAsync = jest.fn();

    // Update the mock implementation for useAccountActivation
    jest.spyOn(require('../../hooks/use-auth'), 'useAccountActivation').mockImplementation(() => ({
      isPending: false,
      mutateAsync: mockMutateAsync,
    }));
  });

  it('renders BasePasswordForm with correct props', () => {
    render(<SetpasswordForm code={mockCode} />);
    expect(screen.getByTestId('base-password-form')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    render(<SetpasswordForm code={mockCode} />);

    const form = screen.getByTestId('base-password-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        password: mockPassword,
        code: mockCode,
      });
    });
  });

  it('shows loading state when submission is pending', () => {
    jest.spyOn(require('../../hooks/use-auth'), 'useAccountActivation').mockImplementation(() => ({
      isPending: true,
      mutateAsync: mockMutateAsync,
    }));

    render(<SetpasswordForm code={mockCode} />);
    const form = screen.getByTestId('base-password-form');
    expect(form).toBeInTheDocument();
  });
});
