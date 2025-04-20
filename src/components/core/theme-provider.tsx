import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * ThemeProvider Component
 *
 * A context provider that manages theme state for your application,
 * supporting light, dark, and system themes with localStorage persistence.
 *
 * Features:
 * - Theme state management (light, dark, system)
 * - Persistent theme selection using localStorage
 * - System theme detection and synchronization
 * - Automatic application of theme classes to the document root
 * - Context API for consuming theme state and functions throughout the app
 *
 * Props:
 * @param {ReactNode} children - Child components that will have access to the theme context
 * @param {Theme} [defaultTheme='light'] - The default theme to use if none is stored
 * @param {string} [storageKey='theme'] - The localStorage key used to persist theme preference
 *
 * @returns {JSX.Element} A context provider that supplies theme values to children
 *
 * @example
 * // Basic usage at the root of your app
 * <ThemeProvider defaultTheme="system">
 *   <App />
 * </ThemeProvider>
 *
 * // Consuming the theme context in a component
 * function ThemeToggle() {
 *   const { theme, setTheme } = useTheme();
 *
 *   return (
 *     <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *       Toggle theme
 *     </button>
 *   );
 * }
 */

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'theme',
}: Readonly<ThemeProviderProps>) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      },
    }),
    [storageKey, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
