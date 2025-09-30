import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ClientMiddleware } from './client-middleware';
import { useAuthStore } from './store/auth';
import { InitialEntry } from '@remix-run/router';

vi.mock('./store/auth', () => ({
  useAuthStore: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}));

describe('ClientMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (authenticated: boolean, path: InitialEntry) => {
    vi.mocked(useAuthStore).mockReturnValue({
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
