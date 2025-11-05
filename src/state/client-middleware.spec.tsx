import { vi, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, InitialEntry } from 'react-router-dom';
import { ClientMiddleware } from './client-middleware';
import { useAuthStore } from './store/auth';

vi.mock('./store/auth', async () => {
  const originalModule = await vi.importActual('./store/auth');
  return {
    ...originalModule,
    useAuthStore: vi.fn(),
  };
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ClientMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (authenticated: boolean, path: InitialEntry) => {
    (useAuthStore as unknown as Mock).mockReturnValue({
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
