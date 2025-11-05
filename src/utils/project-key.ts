// Key used in localStorage for storing the project key
export const LOCAL_STORAGE_PROJECT_KEY = 'projectKey';

/**
 * Retrieves the project key from localStorage.
 * Falls back to environment variable if not present.
 */
export const getProjectKey = (): string => {
  if (typeof window === 'undefined') return '';

  return (
    window.localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY) ??
    import.meta.env.VITE_X_BLOCKS_KEY ??
    ''
  );
};

/**
 * Persists the provided key to localStorage under the standard key.
 */
export const setProjectKey = (key: string): void => {
  if (typeof window === 'undefined' || !key) return;

  window.localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, key);
};

/**
 * Ensures that the project key is available in localStorage.
 * Always updates localStorage with the current environment variable to handle multiple projects.
 * This should be executed once at application startup (e.g., in `src/index.tsx`).
 */
export const initializeProjectKey = (): void => {
  if (typeof window === 'undefined') return;

  const envKey = import.meta.env.VITE_X_BLOCKS_KEY;
  if (envKey) {
    setProjectKey(envKey);
  }
};
