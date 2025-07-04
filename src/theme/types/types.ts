export type ColorName = 'primary' | 'secondary' | string;
export type ColorValue = string;

export interface ThemeColors {
  [key: string]: ColorValue;
}

export interface ThemePalette {
  [key: string]: string; // e.g., 'primary-50': 'h,s,l'
}

export interface ThemeContextType {
  colors: ThemeColors;
  updateColor: (name: ColorName, value: ColorValue) => void;
  generateColorPalette: (baseColor: string, name?: string) => ThemePalette;
}
