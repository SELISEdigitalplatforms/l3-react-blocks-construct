import { useAuthStore } from './index';

const mockStorage = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
  writable: true,
});

describe('AuthState Type', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const { logout } = useAuthStore.getState();
    logout();
  });

  test('should match the expected AuthState interface', () => {
    const state = useAuthStore.getState();

    expect(state).toHaveProperty('isAuthenticated');
    expect(state).toHaveProperty('accessToken');
    expect(state).toHaveProperty('refreshToken');
    expect(state).toHaveProperty('login');
    expect(state).toHaveProperty('setAccessToken');
    expect(state).toHaveProperty('logout');

    expect(typeof state.isAuthenticated).toBe('boolean');
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(typeof state.login).toBe('function');
    expect(typeof state.setAccessToken).toBe('function');
    expect(typeof state.logout).toBe('function');
  });

  test('setAccessToken method should accept one string parameter and update only access token', () => {
    const { login, setAccessToken } = useAuthStore.getState();

    login('initial-access-token', 'initial-refresh-token');

    setAccessToken('updated-access-token');

    const updatedState = useAuthStore.getState();
    expect(updatedState.isAuthenticated).toBe(true);
    expect(updatedState.accessToken).toBe('updated-access-token');
    expect(updatedState.refreshToken).toBe('initial-refresh-token');
  });

  test('logout method should reset auth state to initial values', () => {
    const { login, logout } = useAuthStore.getState();

    login('some-access-token', 'some-refresh-token');

    let currentState = useAuthStore.getState();
    expect(currentState.isAuthenticated).toBe(true);

    logout();

    currentState = useAuthStore.getState();
    expect(currentState.isAuthenticated).toBe(false);
    expect(currentState.accessToken).toBeNull();
    expect(currentState.refreshToken).toBeNull();
  });

  test('state persistence should maintain the correct types after hydration', () => {
    const { login } = useAuthStore.getState();

    login('persisted-token', 'persisted-refresh');

    const persistedJSON = JSON.stringify({
      state: {
        isAuthenticated: true,
        accessToken: 'persisted-token',
        refreshToken: 'persisted-refresh',
      },
    });

    mockStorage.getItem.mockReturnValueOnce(persistedJSON as unknown as null);

    const { getState } = useAuthStore;
    const hydratedState = getState();

    expect(typeof hydratedState.isAuthenticated).toBe('boolean');
    expect(typeof hydratedState.accessToken).toBe('string');
    expect(typeof hydratedState.refreshToken).toBe('string');
  });
});
