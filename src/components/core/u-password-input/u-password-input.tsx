import { forwardRef, useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input, InputProps } from 'components/ui/input';

/**
 * UPasswordInput Component
 *
 * A password input field with toggle functionality to show/hide the password text,
 * designed for enhanced usability while maintaining security.
 *
 * Features:
 * - Toggle between password visibility states
 * - Visual eye icon that changes based on visibility state
 * - Forward ref support for form library integration
 * - Inherits all standard input props
 * - Consistent styling with rounded borders
 *
 * @param {InputProps} props - All standard input props are supported and passed through
 * @param {React.Ref<HTMLInputElement>} ref - Ref forwarded to the underlying input element
 *
 * @returns {JSX.Element} A password input field with visibility toggle
 *
 * @example
 * // Basic usage
 * <UPasswordInput placeholder="Enter your password" />
 *
 * // With form control
 * <UPasswordInput
 *   value={password}
 *   onChange={handleChange}
 *   placeholder="Create a password"
 *   required
 * />
 *
 * // With forwarded ref
 * const inputRef = useRef<HTMLInputElement>(null);
 * <UPasswordInput ref={inputRef} />
 */

export const UPasswordInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [open, setOpen] = useState(false);
  const EyeComponet = open ? EyeOffIcon : EyeIcon;
  return (
    <div className="grid w-full items-center gap-2">
      <div className="relative">
        <Input
          type={open ? 'text' : 'password'}
          {...props}
          ref={ref}
          className="border rounded-lg"
        />
        <EyeComponet
          className="size-5 text-medium-emphasis absolute top-3 right-3"
          onClick={() => setOpen(!open)}
        />
      </div>
    </div>
  );
});
UPasswordInput.displayName = 'UPasswordInput';
