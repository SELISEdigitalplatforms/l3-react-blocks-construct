import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '../../../../lib/utils/test-utils/shared-test-utils';
import { ForgotpasswordForm } from './forgot-password';
import { BrowserRouter } from 'react-router-dom';

const mockUseForgotPassword = vi.fn();
vi.mock('../../hooks/use-auth', () => ({
  useForgotPassword: () => mockUseForgotPassword(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('ForgotpasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseForgotPassword.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue({}),
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ForgotpasswordForm />
      </BrowserRouter>
    );
  };

  it('renders the form with email input and buttons', () => {
    renderComponent();

    expect(screen.getByLabelText(/EMAIL/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ENTER_YOUR_EMAIL/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SEND_RESET_LINK/i })).toBeInTheDocument();
  });

  it('disables submit button while request is pending', () => {
    mockUseForgotPassword.mockReturnValue({
      isPending: true,
      mutateAsync: vi.fn(),
    });

    renderComponent();
    const submitButton = screen.getByRole('button', { name: /SEND_RESET_LINK/i });

    expect(submitButton).toBeDisabled();
  });
});
