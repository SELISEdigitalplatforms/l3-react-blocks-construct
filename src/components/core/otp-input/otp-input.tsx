import React from 'react';
import OtpInput, { AllowedInputTypes, InputProps } from 'react-otp-input';
import { Input } from 'components/ui/input';
import { cn } from 'lib/utils';

/**
 * UIOtpInput Component
 *
 * A customizable OTP (One-Time Password) input component that renders multiple separate
 * input fields for entering verification codes.
 *
 * Features:
 * - Configurable number of input fields
 * - Customizable input rendering
 * - Automatic focus management (optional)
 * - Consistent styling with design system
 * - Support for paste functionality
 * - Flexible styling options
 *
 * Props:
 * @param {string} [value] - Current OTP value
 * @param {number} [numInputs=6] - Number of input fields to display (defaults to 6)
 * @param {(otp: string) => void} onChange - Callback function when OTP changes
 * @param {(event: React.ClipboardEvent<HTMLDivElement>) => void} [onPaste] - Optional callback for paste events
 * @param {(inputProps: InputProps, index: number) => React.ReactNode} [renderInput] - Custom input renderer
 * @param {boolean} [shouldAutoFocus] - Whether to auto-focus the first input on mount
 * @param {string} [placeholder] - Placeholder text for input fields
 * @param {((index: number) => React.ReactNode) | React.ReactNode} [renderSeparator] - Optional separator between inputs
 * @param {React.CSSProperties | string} [containerStyle] - Custom styles for the container
 * @param {React.CSSProperties | string} [inputStyle] - Custom styles for each input
 * @param {AllowedInputTypes} [inputType] - Type of input (text, number, etc.)
 * @param {boolean} [skipDefaultStyles] - Whether to skip default styling
 *
 * @returns {JSX.Element} A series of input fields for OTP entry
 *
 * @example
 * // Basic usage
 * <UIOtpInput
 *   value={otpValue}
 *   onChange={setOtpValue}
 * />
 *
 * // Custom configuration
 * <UIOtpInput
 *   numInputs={4}
 *   value={otpValue}
 *   onChange={handleOtpChange}
 *   inputStyle="text-xl font-bold"
 *   shouldAutoFocus
 * />
 *
 * // With custom input renderer
 * <UIOtpInput
 *   value={otpValue}
 *   onChange={setOtpValue}
 *   renderInput={(props, index) => (
 *     <Input
 *       {...props}
 *       className="bg-primary-50"
 *     />
 *   )}
 * />
 */

export interface UIOtpInputProps {
  value?: string;
  numInputs?: number;
  onChange: (otp: string) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
  renderInput?: (inputProps: InputProps, index: number) => React.ReactNode;
  shouldAutoFocus?: boolean;
  placeholder?: string;
  renderSeparator?: ((index: number) => React.ReactNode) | React.ReactNode;
  containerStyle?: React.CSSProperties | string;
  inputStyle?: React.CSSProperties | string;
  inputType?: AllowedInputTypes;
  skipDefaultStyles?: boolean;
}

const UIOtpInput: React.FC<UIOtpInputProps> = ({
  numInputs = 6,
  value,
  inputStyle,
  onChange,
  renderInput = (props) => <Input {...props} />,
}) => {
  return (
    <OtpInput
      containerStyle="flex w-full justify-between"
      inputStyle={cn('h-[48px] !w-[46px] !text-high-emphasis', inputStyle)}
      numInputs={numInputs}
      value={value}
      onChange={onChange}
      renderInput={renderInput}
    />
  );
};

export default UIOtpInput;
