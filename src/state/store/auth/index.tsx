import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from './index.type';

/**
 * useAuthStore
 *
 * A global authentication state management store using Zustand with persistence.
 * Handles user authentication status, tokens, and related operations.
 *
 * Features:
 * - Persistent authentication state across page reloads
 * - Management of access and refresh tokens
 * - Authentication status tracking
 * - MFA enablement status
 * - Login and logout operations
 * - Token refresh capability
 *
 * State:
 * @property {boolean} isAuthenticated - Whether the user is currently authenticated
 * @property {Object|null} user - The current user data or null if not authenticated
 * @property {string|null} accessToken - The current JWT access token
 * @property {string|null} refreshToken - The current JWT refresh token
 *
 * Actions:
 * @property {(accessToken: string, refreshToken: string) => void} login - Sets auth state to logged in with tokens
 * @property {(accessToken: string) => void} setAccessToken - Updates only the access token
 * @property {() => void} logout - Clears all authentication state and tokens
 *
 * @example
 * // Using the auth store in a component
 * function LoginStatus() {
 *   const { isAuthenticated, login, logout } = useAuthStore();
 *
 *   return (
 *     <div>
 *       {isAuthenticated ? (
 *         <button onClick={logout}>Log Out</button>
 *       ) : (
 *         <button onClick={() => login('access123', 'refresh456')}>Log In</button>
 *       )}
 *     </div>
 *   );
 * }
 */

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      login: (accessToken, refreshToken) =>
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken,
        }),
      setAccessToken: (accessToken) =>
        set({
          accessToken,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
