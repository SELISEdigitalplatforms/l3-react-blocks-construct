import * as React from 'react';

/**
 * EmailInput component is a customizable input field specifically designed for email input.
 * It extends the functionality of the standard `<input>` HTML element, with additional styling
 * and focus effects. The component supports all standard input attributes, including the `type`,
 * `className`, and other HTML input props.
 *
 * This component is wrapped with `React.forwardRef`, allowing it to pass a ref to the underlying
 * `<input>` element, enabling you to reference the DOM node directly.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional custom CSS classes to be applied to the input field.
 * @param {string} [props.type='email'] - The type of input field, defaulting to 'email'.
 * @param {React.Ref<HTMLInputElement>} ref - The forwarded ref to the input element.
 *
 * @returns {JSX.Element} - The EmailInput component, styled and enhanced for email input.
 *
 * @example
 * return (
 *   <EmailInput
 *     className="my-custom-class"
 *     placeholder="Enter your email"
 *     onChange={handleChange}
 *   />
 * )
 */

export type InputEmailProps = React.InputHTMLAttributes<HTMLInputElement>;

const EmailInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={`flex h-11 w-full capitalize rounded-md border-b border-input bg-transparent px-3 py-1 text-sm shadow-sm 
          focus-visible:outline-none focus-visible:border-b focus-visible:border-ring ${className ?? ''}`}
        {...props}
      />
    );
  }
);

EmailInput.displayName = 'EmailInput';

export { EmailInput };
