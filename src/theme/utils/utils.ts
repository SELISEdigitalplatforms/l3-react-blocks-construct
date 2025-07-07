import Color from 'color';

type HSLColor = {
  h: number;
  s: number;
  l: number;
};

/**
 * Custom implementation to generate Tailwind-style color shades
 * This replaces tw-color-shades to avoid TypeScript compilation issues
 */
function generateTailwindShades(baseColor: string): Record<string, string> {
  try {
    const color = Color(baseColor);
    const hsl = color.hsl();
    const h = hsl.hue();
    const s = hsl.saturationl();

    // Tailwind CSS color scale percentages
    const shadePercentages = {
      50: 95,
      100: 90,
      200: 80,
      300: 70,
      400: 60,
      500: 50,
      600: 40,
      700: 30,
      800: 20,
      900: 10,
    };

    const shades: Record<string, string> = {};

    Object.entries(shadePercentages).forEach(([shade, percentage]) => {
      const adjustedLightness = percentage;
      let adjustedSaturation = s;

      // Adjust saturation for lighter and darker shades
      if (percentage >= 80) {
        // Lighter shades: reduce saturation
        adjustedSaturation = Math.max(s * 0.6, 20);
      } else if (percentage <= 20) {
        // Darker shades: increase saturation slightly
        adjustedSaturation = Math.min(s * 1.2, 100);
      }

      // Special adjustments for very light and very dark shades
      if (percentage >= 90) {
        adjustedSaturation = Math.max(s * 0.4, 10);
      } else if (percentage <= 10) {
        adjustedSaturation = Math.min(s * 1.4, 100);
      }

      const shadeColor = Color.hsl(h, adjustedSaturation, adjustedLightness);
      shades[shade] = shadeColor.hex();
    });

    return shades;
  } catch (error) {
    console.warn(`Failed to generate shades for color: ${baseColor}`, error);
    // Fallback to basic shades
    return {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    };
  }
}

/**
 * Converts any color format to HSL using the color package
 */
export function parseColorToHSL(colorString: string): HSLColor {
  try {
    const color = Color(colorString);
    const hsl = color.hsl();
    return {
      h: Math.round(hsl.hue()),
      s: Math.round(hsl.saturationl()),
      l: Math.round(hsl.lightness()),
    };
  } catch (error) {
    console.warn(`Invalid color format: ${colorString}`, error);
    // Fallback to default color
    return { h: 0, s: 0, l: 50 };
  }
}

/**
 * Converts HSL values to CSS HSL string format
 */
export function hslToString(h: number, s: number, l: number): string {
  return `${h}, ${s}%, ${l}%`;
}

/**
 * Validates if a color string is in a valid format
 */
export function isValidColor(color: string): boolean {
  try {
    Color(color);
    return true;
  } catch {
    return false;
  }
}

/**
 * Converts any color format to hex
 */
export function colorToHex(colorString: string): string {
  try {
    const color = Color(colorString);
    return color.hex();
  } catch (error) {
    console.warn(`Invalid color format: ${colorString}`, error);
    return '#000000';
  }
}

/**
 * Converts any color format to HSL string
 */
export function colorToHSL(colorString: string): string {
  try {
    const color = Color(colorString);
    const hsl = color.hsl();
    return `hsl(${Math.round(hsl.hue())}, ${Math.round(hsl.saturationl())}%, ${Math.round(hsl.lightness())}%)`;
  } catch (error) {
    console.warn(`Invalid color format: ${colorString}`, error);
    return 'hsl(0, 0%, 50%)';
  }
}

/**
 * Generates a light color palette using custom Tailwind-style shades
 * The main color will be shade 500
 */
export function generateColorPalette(
  baseColor: string,
  prefix = 'primary'
): Record<string, string> {
  try {
    // Generate shades and then adjust for light mode
    const shades = generateTailwindShades(baseColor);

    return Object.entries(shades).reduce(
      (acc, [shade, hexColor]) => {
        const hsl = parseColorToHSL(hexColor);

        // Light mode adjustments based on shade
        let adjustedLightness = hsl.l;
        let adjustedSaturation = hsl.s;

        switch (shade) {
          case '50':
            adjustedLightness = 95;
            adjustedSaturation = 41;
            break;
          case '100':
            adjustedLightness = 90;
            adjustedSaturation = 41;
            break;
          case '200':
            adjustedLightness = 80;
            adjustedSaturation = 40;
            break;
          case '300':
            adjustedLightness = 70;
            adjustedSaturation = 40;
            break;
          case '400':
            adjustedLightness = 60;
            adjustedSaturation = 63;
            break;
          case '500':
            adjustedLightness = 50;
            adjustedSaturation = 100;
            break;
          case '600':
            adjustedLightness = 40;
            adjustedSaturation = 98;
            break;
          case '700':
            adjustedLightness = 30;
            adjustedSaturation = 97;
            break;
          case '800':
            adjustedLightness = 20;
            adjustedSaturation = 89;
            break;
          case '900':
            adjustedLightness = 10;
            adjustedSaturation = 80;
            break;
        }

        acc[`${prefix}-${shade}`] = hslToString(hsl.h, adjustedSaturation, adjustedLightness);
        return acc;
      },
      {} as Record<string, string>
    );
  } catch (error) {
    console.warn(`Failed to generate palette for color: ${baseColor}`, error);
    // Fallback to basic color generation
    return generateFallbackPalette(baseColor, prefix);
  }
}

/**
 * Generates a dark theme palette using custom Tailwind-style shades with dark mode adjustments
 */
export function generateDarkPalette(baseColor: string, prefix = 'primary'): Record<string, string> {
  try {
    // Generate shades and then adjust for dark mode
    const shades = generateTailwindShades(baseColor);

    return Object.entries(shades).reduce(
      (acc, [shade, hexColor]) => {
        const hsl = parseColorToHSL(hexColor);

        // Dark mode adjustments based on shade
        let adjustedLightness = hsl.l;
        let adjustedSaturation = hsl.s;

        switch (shade) {
          case '50':
            adjustedLightness = 91;
            adjustedSaturation = 41;
            break;
          case '100':
            adjustedLightness = 78;
            adjustedSaturation = 41;
            break;
          case '200':
            adjustedLightness = 64;
            adjustedSaturation = 40;
            break;
          case '300':
            adjustedLightness = 49;
            adjustedSaturation = 40;
            break;
          case '400':
            adjustedLightness = 38;
            adjustedSaturation = 63;
            break;
          case '500':
            adjustedLightness = 28;
            adjustedSaturation = 100;
            break;
          case '600':
            adjustedLightness = 26;
            adjustedSaturation = 98;
            break;
          case '700':
            adjustedLightness = 23;
            adjustedSaturation = 97;
            break;
          case '800':
            adjustedLightness = 21;
            adjustedSaturation = 89;
            break;
          case '900':
            adjustedLightness = 15;
            adjustedSaturation = 80;
            break;
        }

        acc[`${prefix}-${shade}`] = hslToString(hsl.h, adjustedSaturation, adjustedLightness);
        return acc;
      },
      {} as Record<string, string>
    );
  } catch (error) {
    console.warn(`Failed to generate dark palette for color: ${baseColor}`, error);
    // Fallback to basic dark color generation
    return generateFallbackDarkPalette(baseColor, prefix);
  }
}

/**
 * Generates secondary color palette with different hue adjustments using custom shades
 */
export function generateSecondaryPalette(
  baseColor: string,
  prefix = 'secondary'
): Record<string, string> {
  try {
    // Adjust hue for secondary colors (typically 15-30 degrees different)
    const baseHsl = parseColorToHSL(baseColor);
    const adjustedHue = (baseHsl.h + 15) % 360;

    // Create a new color with adjusted hue
    const adjustedColor = Color.hsl(adjustedHue, baseHsl.s, baseHsl.l).hex();

    // Generate shades and apply light mode adjustments
    const shades = generateTailwindShades(adjustedColor);

    return Object.entries(shades).reduce(
      (acc, [shade, hexColor]) => {
        const hsl = parseColorToHSL(hexColor);

        // Light mode adjustments for secondary colors
        let adjustedLightness = hsl.l;
        let adjustedSaturation = hsl.s;

        switch (shade) {
          case '50':
            adjustedLightness = 93;
            adjustedSaturation = 76;
            break;
          case '100':
            adjustedLightness = 83;
            adjustedSaturation = 74;
            break;
          case '200':
            adjustedLightness = 72;
            adjustedSaturation = 73;
            break;
          case '300':
            adjustedLightness = 62;
            adjustedSaturation = 71;
            break;
          case '400':
            adjustedLightness = 57;
            adjustedSaturation = 70;
            break;
          case '500':
            adjustedLightness = 53;
            adjustedSaturation = 68;
            break;
          case '600':
            adjustedLightness = 49;
            adjustedSaturation = 62;
            break;
          case '700':
            adjustedLightness = 44;
            adjustedSaturation = 63;
            break;
          case '800':
            adjustedLightness = 39;
            adjustedSaturation = 63;
            break;
          case '900':
            adjustedLightness = 31;
            adjustedSaturation = 64;
            break;
        }

        acc[`${prefix}-${shade}`] = hslToString(hsl.h, adjustedSaturation, adjustedLightness);
        return acc;
      },
      {} as Record<string, string>
    );
  } catch (error) {
    console.warn(`Failed to generate secondary palette for color: ${baseColor}`, error);
    // Fallback to basic secondary color generation
    return generateFallbackSecondaryPalette(baseColor, prefix);
  }
}

/**
 * Generates dark secondary color palette
 */
export function generateDarkSecondaryPalette(
  baseColor: string,
  prefix = 'secondary'
): Record<string, string> {
  try {
    // Adjust hue for secondary colors
    const baseHsl = parseColorToHSL(baseColor);
    const adjustedHue = (baseHsl.h + 15) % 360;

    // Create a new color with adjusted hue
    const adjustedColor = Color.hsl(adjustedHue, baseHsl.s, baseHsl.l).hex();

    // Generate shades and apply dark mode adjustments
    const shades = generateTailwindShades(adjustedColor);

    return Object.entries(shades).reduce(
      (acc, [shade, hexColor]) => {
        const hsl = parseColorToHSL(hexColor);

        // Dark mode adjustments for secondary colors
        let adjustedLightness = hsl.l;
        let adjustedSaturation = hsl.s;

        switch (shade) {
          case '50':
            adjustedLightness = 17;
            adjustedSaturation = 63;
            break;
          case '100':
            adjustedLightness = 22;
            adjustedSaturation = 64;
            break;
          case '200':
            adjustedLightness = 28;
            adjustedSaturation = 64;
            break;
          case '300':
            adjustedLightness = 36;
            adjustedSaturation = 63;
            break;
          case '400':
            adjustedLightness = 40;
            adjustedSaturation = 64;
            break;
          case '500':
            adjustedLightness = 52;
            adjustedSaturation = 42;
            break;
          case '600':
            adjustedLightness = 60;
            adjustedSaturation = 42;
            break;
          case '700':
            adjustedLightness = 72;
            adjustedSaturation = 42;
            break;
          case '800':
            adjustedLightness = 81;
            adjustedSaturation = 42;
            break;
          case '900':
            adjustedLightness = 94;
            adjustedSaturation = 42;
            break;
        }

        acc[`${prefix}-${shade}`] = hslToString(hsl.h, adjustedSaturation, adjustedLightness);
        return acc;
      },
      {} as Record<string, string>
    );
  } catch (error) {
    console.warn(`Failed to generate dark secondary palette for color: ${baseColor}`, error);
    // Fallback to basic dark secondary color generation
    return generateFallbackDarkSecondaryPalette(baseColor, prefix);
  }
}

/**
 * Fallback palette generation when custom shades fail
 */
function generateFallbackPalette(baseColor: string, prefix = 'primary'): Record<string, string> {
  const { h, s } = parseColorToHSL(baseColor);

  const shades = {
    50: { s: Math.max(s - 50, 41), l: 91 },
    100: { s: Math.max(s - 42, 41), l: 78 },
    200: { s: Math.max(s - 41, 40), l: 64 },
    300: { s: Math.max(s - 41, 40), l: 49 },
    400: { s: Math.max(s - 18, 63), l: 38 },
    500: { s: 100, l: 28 },
    600: { s: 98, l: 26 },
    700: { s: 97, l: 23 },
    800: { s: 89, l: 21 },
    900: { s: 80, l: 15 },
  };

  return Object.entries(shades).reduce(
    (acc, [shade, { s: saturation, l: lightness }]) => {
      acc[`${prefix}-${shade}`] = hslToString(h, saturation, lightness);
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Fallback dark palette generation
 */
function generateFallbackDarkPalette(
  baseColor: string,
  prefix = 'primary'
): Record<string, string> {
  const { h } = parseColorToHSL(baseColor);

  const shades = {
    50: { s: 100, l: 12 },
    100: { s: 100, l: 17 },
    200: { s: 100, l: 21 },
    300: { s: 100, l: 24 },
    400: { s: 100, l: 26 },
    500: { s: 76, l: 35 },
    600: { s: 44, l: 47 },
    700: { s: 40, l: 63 },
    800: { s: 40, l: 77 },
    900: { s: 39, l: 91 },
  };

  return Object.entries(shades).reduce(
    (acc, [shade, { s: saturation, l: lightness }]) => {
      acc[`${prefix}-${shade}`] = hslToString(h, saturation, lightness);
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Fallback secondary palette generation
 */
function generateFallbackSecondaryPalette(
  baseColor: string,
  prefix = 'secondary'
): Record<string, string> {
  const { h, s } = parseColorToHSL(baseColor);
  const adjustedHue = (h + 15) % 360;

  const shades = {
    50: { s: Math.max(s - 23, 76), l: 93 },
    100: { s: Math.max(s - 25, 74), l: 83 },
    200: { s: Math.max(s - 26, 73), l: 72 },
    300: { s: Math.max(s - 28, 71), l: 62 },
    400: { s: Math.max(s - 29, 70), l: 57 },
    500: { s: Math.max(s - 31, 68), l: 53 },
    600: { s: Math.max(s - 37, 62), l: 49 },
    700: { s: Math.max(s - 36, 63), l: 44 },
    800: { s: Math.max(s - 36, 63), l: 39 },
    900: { s: Math.max(s - 35, 64), l: 31 },
  };

  return Object.entries(shades).reduce(
    (acc, [shade, { s: saturation, l: lightness }]) => {
      acc[`${prefix}-${shade}`] = hslToString(adjustedHue, saturation, lightness);
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Fallback dark secondary palette generation
 */
function generateFallbackDarkSecondaryPalette(
  baseColor: string,
  prefix = 'secondary'
): Record<string, string> {
  const { h } = parseColorToHSL(baseColor);
  const adjustedHue = (h + 15) % 360;

  const shades = {
    50: { s: 63, l: 17 },
    100: { s: 64, l: 22 },
    200: { s: 64, l: 28 },
    300: { s: 63, l: 36 },
    400: { s: 64, l: 40 },
    500: { s: 42, l: 52 },
    600: { s: 42, l: 60 },
    700: { s: 42, l: 72 },
    800: { s: 42, l: 81 },
    900: { s: 42, l: 94 },
  };

  return Object.entries(shades).reduce(
    (acc, [shade, { s: saturation, l: lightness }]) => {
      acc[`${prefix}-${shade}`] = hslToString(adjustedHue, saturation, lightness);
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Generates a color with adjusted lightness
 */
export function adjustLightness(colorString: string, lightness: number): string {
  try {
    const color = Color(colorString);
    return color.lightness(lightness).hex();
  } catch (error) {
    console.warn(`Invalid color format: ${colorString}`, error);
    return colorString;
  }
}

/**
 * Generates a color with adjusted saturation
 */
export function adjustSaturation(colorString: string, saturation: number): string {
  try {
    const color = Color(colorString);
    return color.saturationl(saturation).hex();
  } catch (error) {
    console.warn(`Invalid color format: ${colorString}`, error);
    return colorString;
  }
}

/**
 * Generates a color with adjusted hue
 */
export function adjustHue(colorString: string, hue: number): string {
  try {
    const color = Color(colorString);
    return color.rotate(hue).hex();
  } catch (error) {
    console.warn(`Invalid color format: ${colorString}`, error);
    return colorString;
  }
}

/**
 * Applies primary and secondary theme palettes to the document root
 */
export function applyTheme(primaryColor: string, secondaryColor: string): void {
  const root = document.documentElement;

  const applyPalette = (palette: Record<string, string>) => {
    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  // Apply light mode palettes
  applyPalette(generateColorPalette(primaryColor, 'primary'));
  applyPalette(generateSecondaryPalette(secondaryColor, 'secondary'));

  // Apply dark mode palettes
  applyPalette(generateDarkPalette(primaryColor, 'primary'));
  applyPalette(generateDarkSecondaryPalette(secondaryColor, 'secondary'));
}
