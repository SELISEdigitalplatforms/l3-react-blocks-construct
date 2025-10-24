import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getThemeColors, type HSLColor } from './utils/utils';

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
  colors: {
    primary: string;
    secondary: string;
  };
  setTheme: (theme: Theme) => void;
};

type ColorPalette = {
  [key: string]: HSLColor;
};

const initialState: ThemeProviderState = {
  theme: 'light',
  colors: {
    primary: import.meta.env.VITE_PRIMARY_COLOR || '',
    secondary: import.meta.env.VITE_SECONDARY_COLOR || '',
  },
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

  const [colors, setColors] = useState(() => {
    const themeColors = getThemeColors();
    const currentTheme = theme === 'dark' ? themeColors.dark : themeColors.light;
    const defaultPrimary = import.meta.env.VITE_PRIMARY_COLOR || '#15969B';
    const defaultSecondary = import.meta.env.VITE_SECONDARY_COLOR || '#5194B8';

    // Helper function to resolve color value
    const resolveColor = (
      color: string | HSLColor | ColorPalette | null | undefined,
      defaultValue: string
    ): string => {
      if (!color) return defaultValue;
      if (typeof color === 'string') return color;

      const hslColor = color as HSLColor;
      if (
        hslColor &&
        typeof hslColor === 'object' &&
        'h' in hslColor &&
        's' in hslColor &&
        'l' in hslColor
      ) {
        return `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`;
      }

      const colorPalette = color as ColorPalette;
      const firstColor = Object.values(colorPalette)[0];
      if (firstColor && 'h' in firstColor && 's' in firstColor && 'l' in firstColor) {
        return `hsl(${firstColor.h}, ${firstColor.s}%, ${firstColor.l}%)`;
      }

      return defaultValue;
    };

    const primaryColor = resolveColor(currentTheme.primary, defaultPrimary);
    const secondaryColor = resolveColor(currentTheme.secondary, defaultSecondary);

    return {
      primary: primaryColor,
      secondary: secondaryColor,
    };
  });

  useEffect(() => {
    const { light, dark } = getThemeColors();
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const colorSet = isDark ? dark : light;

    const style = document.documentElement.style;

    const setColorVariables = (prefix: string, palette: ColorPalette) => {
      Object.entries(palette).forEach(([key, value]) => {
        if (value) {
          style.setProperty(`--${prefix}-${key}`, `${value.h}, ${value.s}%, ${value.l}%`);
        }
      });
    };

    if (colorSet.primary) {
      setColorVariables('primary', colorSet.primary);
    }

    if (colorSet.secondary) {
      setColorVariables('secondary', colorSet.secondary);
    }

    setColors({
      primary: import.meta.env.VITE_PRIMARY_COLOR || '#15969B',
      secondary: import.meta.env.VITE_SECONDARY_COLOR || '#5194B8',
    });
  }, [theme]);

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
      colors,
      setTheme: (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
      },
    }),
    [theme, colors, storageKey]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
