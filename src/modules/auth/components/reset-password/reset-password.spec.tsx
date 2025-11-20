import { vi, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResetpasswordForm } from './reset-password';
import { useResetPassword } from '../../hooks/use-auth';
import '../../../../lib/utils/test-utils/shared-test-utils';

const TEST_PASSWORD = 'testPassword123';

vi.mock('../../hooks/use-auth', () => ({
  useResetPassword: vi.fn(),
}));

type BasePasswordFormProps = {
  onSubmit: (password: string, code: string) => Promise<void>;
  isPending: boolean;
  code: string;
};

vi.mock('@/components/core', () => ({
  BasePasswordForm: ({ onSubmit, isPending, code }: BasePasswordFormProps) => (
    <form
      data-testid="base-password-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(TEST_PASSWORD, code);
      }}
    >
      <input type="password" data-testid="password-input" />
      <button type="submit" disabled={isPending}>
        Submit
      </button>
    </form>
  ),
}));

describe('ResetpasswordForm', () => {
  const mockMutateAsync = vi.fn();
  const mockCode = 'test-reset-code-123';

  beforeEach(() => {
    vi.clearAllMocks();
    (useResetPassword as Mock).mockReturnValue({
      isPending: false,
      mutateAsync: mockMutateAsync,
    });
  });

  it('renders the BasePasswordForm component', () => {
    render(<ResetpasswordForm code={mockCode} />);
    expect(screen.getByTestId('base-password-form')).toBeInTheDocument();
  });

  it('passes the correct props to BasePasswordForm', () => {
    const { container } = render(<ResetpasswordForm code={mockCode} />);
    expect(container.firstChild).toHaveAttribute('data-testid', 'base-password-form');
  });

  it('handles form submission correctly', async () => {
    render(<ResetpasswordForm code={mockCode} />);

    const form = screen.getByTestId('base-password-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        password: TEST_PASSWORD,
        code: mockCode,
      });
    });
  });

  it('disables form submission while request is pending', () => {
    (useResetPassword as Mock).mockReturnValue({
      isPending: true,
      mutateAsync: mockMutateAsync,
    });

    render(<ResetpasswordForm code={mockCode} />);

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
  });

  it('enables form submission when not pending', () => {
    (useResetPassword as Mock).mockReturnValue({
      isPending: false,
      mutateAsync: mockMutateAsync,
    });

    render(<ResetpasswordForm code={mockCode} />);

    const submitButton = screen.getByRole('button');
    expect(submitButton).not.toBeDisabled();
  });
});
