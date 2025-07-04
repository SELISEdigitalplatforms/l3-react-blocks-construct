# Dynamic Theming Guide

This project supports dynamic theming with Tailwind CSS, allowing you to change the primary color of the application at runtime using environment variables.

## How It Works

The theming system uses CSS variables and JavaScript to dynamically update the application's color scheme. The primary color and its variations are generated from a base color and applied to the document root.

## Setting Up a Custom Theme

1. **Environment Variable**
   Set the `REACT_APP_PRIMARY_COLOR` environment variable to your desired primary color (hex or HSL format):
   ```env
   REACT_APP_PRIMARY_COLOR=#3B82F6  # Example: blue-500
   ```

2. **Color Format**
   - Hex: `#RRGGBB` or `#RGB`
   - HSL: `hsl(hue, saturation%, lightness%)`

3. **Default Color**
   If no color is specified, it defaults to `#00A19C` (a teal color).

## Using Theme Colors in Components

Use the primary color variants in your components with Tailwind's color utilities:

```tsx
// Using primary color variants
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded">
  Click me
</button>
```

## Available Color Variants

The system generates the following color variants based on the primary color:

- `primary-50` to `primary-900` (light to dark)
- Automatic dark mode variants
- Accessible text colors for each background

## Programmatic Theme Updates

You can also change the theme programmatically using the `useTheme` hook:

```tsx
import { useTheme } from './theme/ThemeProvider';

function ThemeSwitcher() {
  const { primaryColor, setPrimaryColor } = useTheme();
  
  return (
    <div>
      <button 
        onClick={() => setPrimaryColor('#3B82F6')} 
        className="bg-blue-500 text-white p-2 rounded"
      >
        Blue Theme
      </button>
      <button 
        onClick={() => setPrimaryColor('#10B981')} 
        className="bg-green-500 text-white p-2 rounded ml-2"
      >
        Green Theme
      </button>
    </div>
  );
}
```

## Adding Custom Themes

To add a custom theme:

1. Update the `generateColorPalette` function in `src/theme/theme-utils.ts` to customize how colors are generated.
2. Modify the `generateDarkPalette` function for dark mode variants.
3. Update the CSS variables in `src/styles/globals.css` to use your custom properties.

## Best Practices

- Use semantic color names in your components (e.g., `bg-primary` instead of `bg-blue-500`)
- Test color contrast for accessibility
- Consider both light and dark mode when choosing colors
- Use the theme context for dynamic theming rather than hardcoded colors
