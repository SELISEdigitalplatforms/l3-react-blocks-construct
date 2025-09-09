import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ForgotpasswordForm } from './forgot-password';
import { BrowserRouter } from 'react-router-dom';

const mockUseForgotPassword = jest.fn();
jest.mock('../../hooks/use-auth', () => ({
  useForgotPassword: () => mockUseForgotPassword(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('ForgotpasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseForgotPassword.mockReturnValue({
      isPending: false,
      mutateAsync: jest.fn().mockResolvedValue({}),
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

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter_your_email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send_reset_link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go_to_login/i })).toBeInTheDocument();
  });

  it('disables submit button while request is pending', () => {
    mockUseForgotPassword.mockReturnValue({
      isPending: true,
      mutateAsync: jest.fn(),
    });

    renderComponent();
    const submitButton = screen.getByRole('button', { name: /send_reset_link/i });

    expect(submitButton).toBeDisabled();
  });

  it('navigates to login page when clicking "Go to Log in" button', async () => {
    renderComponent();
    const loginButton = screen.getByRole('button', { name: /go_to_login/i });

    await userEvent.click(loginButton);
    expect(screen.getByRole('link', { name: /go_to_login/i })).toHaveAttribute('href', '/login');
  });
});
