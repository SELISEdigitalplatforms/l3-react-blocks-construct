import { useState } from 'react';
import { Check } from 'lucide-react';
import { CalendarEventColor } from '../../enums/calendar.enum';

interface ColorPickerProps {
  selectedColor?: string | null;
  onColorChange?: (color: string) => void;
  defaultColor?: string | null;
  colors?: string[];
}

/**
 * ColorPickerTool Component
 *
 * A small, interactive color selector that supports both controlled and uncontrolled usage.
 * Renders a row of clickable color circles, highlighting the selected color with a check icon and a ring.
 *
 * Features:
 * - Controlled (`selectedColor`) or uncontrolled (`defaultColor`) usage
 * - Highlights the active color
 * - Customizable color palette
 * - Emits `onColorChange` on selection (in controlled mode)
 *
 * Props:
 * - `selectedColor`: Optional external color to control selection
 * - `onColorChange`: Optional handler to be called on color selection
 * - `defaultColor`: Initial selected color (when uncontrolled)
 * - `colors`: Array of available colors (defaults to `CalendarEventColor` enum values)
 *
 * @param {ColorPickerProps} props - Configuration and event handlers
 * @example
 * <ColorPickerTool
 *   selectedColor={currentColor}
 *   onColorChange={(color) => setCurrentColor(color)}
 * />
 */

export const ColorPickerTool = ({
  selectedColor: externalColor,
  onColorChange,
  defaultColor = null,
  colors = Object.values(CalendarEventColor),
}: Readonly<ColorPickerProps>) => {
  const [internalColor, setInternalColor] = useState(defaultColor);
  const isControlled = externalColor !== undefined;
  const currentColor = isControlled ? externalColor : internalColor;

  const handleColorSelect = (color: string) => {
    if (isControlled) {
      onColorChange?.(color);
    } else {
      setInternalColor(color);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => handleColorSelect(color)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleColorSelect(color);
            }
          }}
          type="button"
          aria-label={`Select color ${color}`}
          style={{
            backgroundColor: `${color}`,
          }}
          className={`
            cursor-pointezr w-6 h-6 rounded-full
            flex items-center justify-center transition-all
            ${currentColor === color ? 'ring-2 ring-neutral-200 scale-110' : 'ring-2 ring-neutral-100'}
          `}
        >
          {currentColor === color && <Check className="w-4 h-4 text-black" />}
        </button>
      ))}
    </div>
  );
};
