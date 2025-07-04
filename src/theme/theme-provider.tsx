'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { applyTheme } from './utils/utils';

// Types
export type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: ReactNode;
  initialPrimaryColor?: string;
  initialSecondaryColor?: string;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const defaultTheme = {
  primary: '#008F8F',
  secondary: '#7498AD',
  theme: 'light' as Theme,
  storageKey: 'theme',
};

const throwError = () => {
  throw new Error('ThemeContext function called outside of ThemeProvider');
};

const ThemeContext = createContext<ThemeContextType>({
  primaryColor: defaultTheme.primary,
  secondaryColor: defaultTheme.secondary,
  setPrimaryColor: throwError,
  setSecondaryColor: throwError,
  theme: defaultTheme.theme,
  setTheme: throwError,
});

export function ThemeProvider({
  children,
  initialPrimaryColor,
  initialSecondaryColor,
  defaultTheme: defaultThemeProp = 'light',
  storageKey = 'theme',
}: ThemeProviderProps) {
  // Dynamic color state
  const [primaryColor, setPrimaryColorState] = useState<string>(
    initialPrimaryColor ||
      (typeof window !== 'undefined' ? localStorage.getItem('primaryColor') : null) ||
      defaultTheme.primary
  );
  const [secondaryColor, setSecondaryColorState] = useState<string>(
    initialSecondaryColor ||
      (typeof window !== 'undefined' ? localStorage.getItem('secondaryColor') : null) ||
      defaultTheme.secondary
  );

  // Theme state (light/dark/system)
  const [theme, setThemeState] = useState<Theme>(
    () =>
      (typeof window !== 'undefined' ? (localStorage.getItem(storageKey) as Theme) : null) ||
      defaultThemeProp
  );

  // Apply dynamic theme colors
  useEffect(() => {
    applyTheme(primaryColor, secondaryColor);
    if (typeof window !== 'undefined') {
      localStorage.setItem('primaryColor', primaryColor);
      localStorage.setItem('secondaryColor', secondaryColor);
    }
  }, [primaryColor, secondaryColor]);

  // Apply dark/light/system mode to <html>
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // Setters with validation
  const setPrimaryColor = (color: string) => {
    if (isValidColor(color)) {
      setPrimaryColorState(color);
    } else {
      console.warn(
        `Invalid color format: ${color}. Expected hex (e.g., #00A19C) or hsl (e.g., hsl(178, 100%, 32%))`
      );
    }
  };
  const setSecondaryColor = (color: string) => {
    if (isValidColor(color)) {
      setSecondaryColorState(color);
    } else {
      console.warn(
        `Invalid color format: ${color}. Expected hex (e.g., #A10058) or hsl (e.g., hsl(321, 100%, 32%))`
      );
    }
  };
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  // Memoize context value
  const value = useMemo(
    () => ({
      primaryColor,
      secondaryColor,
      setPrimaryColor,
      setSecondaryColor,
      theme,
      setTheme,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [primaryColor, secondaryColor, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// Helper function to validate color format
function isValidColor(color: string): boolean {
  // Check if it's a valid hex color
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  // Check if it's a valid HSL color
  const hslRegex = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;
  return hexRegex.test(color) || hslRegex.test(color);
}
