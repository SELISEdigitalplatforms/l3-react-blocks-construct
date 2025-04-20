import { Checkbox } from 'components/ui/checkbox';
import { UCheckboxProps } from './index.type';

/**
 * UCheckbox Component
 *
 * A styled checkbox input with an optional label, designed for consistent
 * UI appearance across forms and user interfaces.
 *
 * Features:
 * - Customized checkbox styling with border emphasis
 * - Optional associated label with customizable styling
 * - Accessible design with proper label association
 * - Visual feedback for disabled states
 * - Consistent spacing between checkbox and label
 *
 * Props:
 * @param {string} [label] - Optional text label displayed next to the checkbox
 * @param {string} [labelClassName] - Optional CSS classes to apply to the label element
 *
 * @returns {JSX.Element} A styled checkbox with optional label
 *
 * @example
 * // Basic usage with label
 * <UCheckbox label="I agree to the terms and conditions" />
 *
 * // With custom label styling
 * <UCheckbox
 *   label="Remember me"
 *   labelClassName="text-primary font-bold"
 * />
 *
 * @note The checkbox id is currently hardcoded as "terms" which may need to be made configurable
 * if multiple checkboxes are used on the same page
 */

export function UCheckbox({ label, labelClassName }: Readonly<UCheckboxProps>) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        className="border-medium-emphasis data-[state=checked]:border-none border-2 rounded-[2px]"
      />
      {label && (
        <label
          htmlFor="terms"
          className={`text-sm text-medium-emphasis font-medium  peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${labelClassName}`}
        >
          {label}
        </label>
      )}
    </div>
  );
}
