import { useAuthStore } from '.';

// Mock localStorage before importing the store
const mockStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
  writable: true,
});

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset the store state
    const { logout } = useAuthStore.getState();
    logout();
  });

  test('should initialize with default values', () => {
    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });

  test('login action should update authentication state', () => {
    const { login } = useAuthStore.getState();

    const mockAccessToken = 'test-access-token';
    const mockRefreshToken = 'test-refresh-token';

    login(mockAccessToken, mockRefreshToken);

    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(true);
    expect(state.accessToken).toBe(mockAccessToken);
    expect(state.refreshToken).toBe(mockRefreshToken);
  });

  test('setAccessToken action should update only the access token', () => {
    const { login, setAccessToken } = useAuthStore.getState();

    login('initial-access-token', 'initial-refresh-token');

    const newAccessToken = 'updated-access-token';
    setAccessToken(newAccessToken);

    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(true);
    expect(state.accessToken).toBe(newAccessToken);
    expect(state.refreshToken).toBe('initial-refresh-token');
  });

  test('logout action should reset authentication state', () => {
    const { login, logout } = useAuthStore.getState();

    login('test-access-token', 'test-refresh-token');

    logout();

    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });
});
