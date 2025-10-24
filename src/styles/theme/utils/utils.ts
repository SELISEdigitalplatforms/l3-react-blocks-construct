export type HSLColor = {
  h: number;
  s: number;
  l: number;
};

type ColorPalette = {
  [key: string]: HSLColor;
};

type ThemeColors = {
  primary: ColorPalette | null;
  secondary: ColorPalette | null;
};

import Color from 'color';

export const parseColor = (color: string): HSLColor | null => {
  try {
    const colorObj = new Color(color);
    const hslObj = colorObj.hsl().object();

    return {
      h: Math.round(hslObj.h || 0), // h can be undefined for grayscale colors
      s: Math.round(hslObj.s * 100 * 100) / 100,
      l: Math.round(hslObj.l * 100 * 100) / 100,
    };
  } catch (error) {
    console.error(`Failed to parse color: ${color}`, error);
    return null;
  }
};

export const generateColorPalette = (baseColor: string, isDark = false): ColorPalette | null => {
  const base = parseColor(baseColor);
  if (!base) return null;

  const { h, s: baseS } = base;
  const s = Math.min(100, baseS); // Ensure saturation doesn't exceed 100
  const isPrimary = baseColor === (import.meta.env.VITE_PRIMARY_COLOR || '');

  if (isDark) {
    if (isPrimary) {
      return {
        50: { h, s: Math.max(15, s * 0.3), l: 12 },
        100: { h, s: Math.max(20, s * 0.4), l: 17 },
        200: { h, s: Math.max(30, s * 0.5), l: 22 },
        300: { h, s: Math.max(40, s * 0.6), l: 28 },
        400: { h, s: Math.max(50, s * 0.7), l: 36 },
        500: { h, s: Math.max(60, s * 0.8), l: 42 },
        600: { h, s: Math.max(70, s * 0.9), l: 60 },
        700: { h, s: Math.max(80, s * 1.0), l: 72 },
        800: { h, s: Math.max(90, s * 1.0), l: 81 },
        900: { h, s: Math.max(95, s * 1.0), l: 94 },
      };
    }

    return {
      50: { h, s: Math.max(20, s * 0.3), l: 15 },
      100: { h, s: Math.max(25, s * 0.4), l: 22 },
      200: { h, s: Math.max(30, s * 0.5), l: 30 },
      300: { h, s: Math.max(40, s * 0.6), l: 40 },
      400: { h, s: Math.max(50, s * 0.7), l: 50 },
      500: { h, s: Math.max(60, s * 0.8), l: 60 },
      600: { h, s: Math.max(70, s * 0.9), l: 70 },
      700: { h, s: Math.max(80, s * 1.0), l: 80 },
      800: { h, s: Math.max(90, s * 1.0), l: 90 },
      900: { h, s: Math.max(95, s * 1.0), l: 95 },
    };
  }

  if (isPrimary) {
    return {
      50: { h, s: Math.max(15, s * 0.3), l: 88 },
      100: { h, s: Math.max(20, s * 0.4), l: 75 },
      200: { h, s: Math.max(15, s * 0.4), l: 64 },
      300: { h, s: Math.max(20, s * 0.5), l: 49 },
      400: { h, s: Math.max(30, s * 0.6), l: 38 },
      500: { h, s, l: 28 },
      600: { h, s, l: 26 },
      700: { h, s, l: 23 },
      800: { h, s, l: 21 },
      900: { h, s, l: 15 },
    };
  }

  return {
    50: { h, s: Math.max(10, s * 0.2), l: 97 },
    100: { h, s: Math.max(15, s * 0.3), l: 93 },
    200: { h, s: Math.max(20, s * 0.4), l: 85 },
    300: { h, s: Math.max(30, s * 0.5), l: 75 },
    400: { h, s: Math.max(40, s * 0.6), l: 65 },
    500: { h, s: Math.max(50, s * 0.7), l: 55 },
    600: { h, s: Math.max(60, s * 0.8), l: 45 },
    700: { h, s: Math.max(70, s * 0.9), l: 35 },
    800: { h, s: Math.max(80, s * 1.0), l: 25 },
    900: { h, s: Math.max(90, s * 1.0), l: 15 },
  };
};

const defaultColors = {
  light: {
    primary: {
      50: { h: 183, s: 41, l: 91 },
      100: { h: 183, s: 41, l: 78 },
      200: { h: 181, s: 40, l: 64 },
      300: { h: 181, s: 40, l: 49 },
      400: { h: 180, s: 63, l: 38 },
      500: { h: 179, s: 100, l: 28 },
      600: { h: 179, s: 98, l: 26 },
      700: { h: 178, s: 97, l: 23 },
      800: { h: 177, s: 89, l: 21 },
      900: { h: 175, s: 80, l: 15 },
    },
    secondary: {
      50: { h: 198, s: 76, l: 93 },
      100: { h: 198, s: 74, l: 83 },
      200: { h: 198, s: 73, l: 72 },
      300: { h: 199, s: 71, l: 62 },
      400: { h: 200, s: 70, l: 57 },
      500: { h: 202, s: 68, l: 53 },
      600: { h: 202, s: 62, l: 49 },
      700: { h: 204, s: 63, l: 44 },
      800: { h: 205, s: 63, l: 39 },
      900: { h: 210, s: 64, l: 31 },
    },
  },
  dark: {
    primary: {
      50: { h: 178, s: 100, l: 12 },
      100: { h: 180, s: 100, l: 17 },
      200: { h: 180, s: 100, l: 21 },
      300: { h: 181, s: 100, l: 24 },
      400: { h: 181, s: 100, l: 26 },
      500: { h: 182, s: 76, l: 35 },
      600: { h: 183, s: 44, l: 47 },
      700: { h: 185, s: 40, l: 63 },
      800: { h: 185, s: 40, l: 77 },
      900: { h: 187, s: 39, l: 91 },
    },
    secondary: {
      50: { h: 201, s: 63, l: 17 },
      100: { h: 200, s: 64, l: 22 },
      200: { h: 201, s: 64, l: 28 },
      300: { h: 201, s: 63, l: 36 },
      400: { h: 201, s: 64, l: 40 },
      500: { h: 201, s: 42, l: 52 },
      600: { h: 201, s: 42, l: 60 },
      700: { h: 201, s: 42, l: 72 },
      800: { h: 201, s: 42, l: 81 },
      900: { h: 198, s: 42, l: 94 },
    },
  },
} as const;

export const getThemeColors = (): { light: ThemeColors; dark: ThemeColors } => {
  const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '';
  const secondaryColor = import.meta.env.VITE_SECONDARY_COLOR || '';

  // Only generate palettes if colors are provided in env
  const lightPrimary = primaryColor ? generateColorPalette(primaryColor, false) : null;
  const darkPrimary = primaryColor ? generateColorPalette(primaryColor, true) : null;
  const lightSecondary = secondaryColor ? generateColorPalette(secondaryColor, false) : null;
  const darkSecondary = secondaryColor ? generateColorPalette(secondaryColor, true) : null;

  return {
    light: {
      primary: lightPrimary || defaultColors.light.primary,
      secondary: lightSecondary || defaultColors.light.secondary,
    },
    dark: {
      primary: darkPrimary || defaultColors.dark.primary,
      secondary: darkSecondary || defaultColors.dark.secondary,
    },
  };
};
