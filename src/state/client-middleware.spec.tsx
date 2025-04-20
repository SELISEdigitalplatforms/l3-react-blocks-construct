import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ClientMiddleware } from './client-middleware';
import { useAuthStore } from './store/auth';
import { InitialEntry } from '@remix-run/router';

jest.mock('./store/auth', () => {
  const originalModule = jest.requireActual('./store/auth');
  return {
    ...originalModule,
    useAuthStore: jest.fn(),
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ClientMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (authenticated: boolean, path: InitialEntry) => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: authenticated,
    });

    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path="*"
            element={
              <ClientMiddleware>
                <div data-testid="protected-content">Protected Content</div>
              </ClientMiddleware>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should render children when user is authenticated', async () => {
    renderWithRouter(true, '/dashboard');

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated on protected route', async () => {
    renderWithRouter(false, '/dashboard');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should render public routes without redirection when user is not authenticated', async () => {
    renderWithRouter(false, '/login');

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should not redirect when on public route even if not authenticated', async () => {
    renderWithRouter(false, '/signup');

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
