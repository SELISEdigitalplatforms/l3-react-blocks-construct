// theming-utils.ts

type HSLColor = {
  h: number;
  s: number;
  l: number;
};

/**
 * Converts a hex color to HSL format.
 */
export function hexToHSL(hex: string): HSLColor {
  hex = hex.replace(/^#/, '');

  if (hex.length !== 6) {
    throw new Error(`Invalid HEX color: ${hex}`);
  }

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      case b:
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Parses a CSS HSL string into HSL components.
 */
export function parseHSL(hslString: string): HSLColor {
  const match = hslString.match(/(\d+),\s*(\d+)%?,\s*(\d+)%?/);
  if (!match) {
    throw new Error(`Invalid HSL color: ${hslString}`);
  }

  return {
    h: parseInt(match[1], 10),
    s: parseInt(match[2], 10),
    l: parseInt(match[3], 10),
  };
}

/**
 * Generates a light color palette from a base color.
 */
export function generateColorPalette(
  baseColor: string,
  prefix = 'primary'
): Record<string, string> {
  const { h, s } = baseColor.startsWith('hsl') ? parseHSL(baseColor) : hexToHSL(baseColor);

  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const lightness = [91, 78, 64, 49, 38, 28, 23, 18, 13, 8];
  const saturation = [s, s, s - 5, s - 5, s + 10, 100, 100, 100, 100, 100];

  return shades.reduce(
    (acc, shade, index) => {
      const l = lightness[index];
      const sat = Math.max(0, Math.min(100, saturation[index]));
      acc[`${prefix}-${shade}`] = `${h}, ${sat}%, ${l}%`;
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Generates a dark theme palette from a base color.
 */
export function generateDarkPalette(baseColor: string, prefix = 'primary'): Record<string, string> {
  const { h } = baseColor.startsWith('hsl') ? parseHSL(baseColor) : hexToHSL(baseColor);

  const shades = {
    50: `${h}, 100%, 12%`,
    100: `${h}, 100%, 17%`,
    200: `${h}, 100%, 21%`,
    300: `${h}, 100%, 26%`,
    400: `${h}, 100%, 31%`,
    500: `${h}, 100%, 36%`,
    600: `${h}, 90%, 41%`,
    700: `${h}, 80%, 46%`,
    800: `${h}, 70%, 51%`,
    900: `${h}, 60%, 56%`,
  };

  return Object.entries(shades).reduce(
    (acc, [shade, value]) => {
      acc[`${prefix}-${shade}-dark`] = value;
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Applies primary and secondary theme palettes to the document root.
 */
export function applyTheme(primaryColor: string, secondaryColor: string): void {
  const root = document.documentElement;

  const applyPalette = (palette: Record<string, string>) => {
    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  applyPalette(generateColorPalette(primaryColor, 'primary'));
  applyPalette(generateColorPalette(secondaryColor, 'secondary'));

  applyPalette(generateDarkPalette(primaryColor, 'primary'));
  applyPalette(generateDarkPalette(secondaryColor, 'secondary'));
}
