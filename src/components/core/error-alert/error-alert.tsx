import { useState, useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * ErrorAlert Component
 *
 * A reusable alert component that displays error messages with automatic timeout functionality.
 * The alert will automatically disappear after 5 seconds when an error is triggered.
 *
 * Features:
 * - Automatic visibility management based on error state
 * - Configurable title and message
 * - Automatic dismissal after 5 seconds
 * - Visual styling for error states with smooth transitions
 *
 * Props:
 * @param {boolean} isError - Whether an error state is active, triggering the alert to display
 * @param {string} [title='Error'] - The title text displayed in the alert header
 * @param {string} [message='An error occurred.'] - The detailed error message to display
 *
 * @returns {JSX.Element|null} The error alert component when visible, or null when not visible
 *
 * @example
 * // Basic usage
 * <ErrorAlert isError={hasError} />
 *
 * // With custom title and message
 * <ErrorAlert
 *   isError={submitFailed}
 *   title="Submission Failed"
 *   message="Please check your form inputs and try again."
 * />
 */

interface ErrorAlertProps {
  isError: boolean;
  title?: string;
  message?: string;
}

export const ErrorAlert = ({
  isError,
  title = 'ERROR',
  message = 'AN_ERROR_OCCURRED.',
}: Readonly<ErrorAlertProps>) => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isError) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isError]);

  if (!isVisible) return null;

  return (
    <div className="rounded-lg bg-red-50 border border-red-400 p-4 mb-2 transition-all duration-1000 ease-in-out opacity-100">
      <div className="flex items-center gap-1">
        <TriangleAlert className="text-error w-4 h-4" />
        <h1 className="text-error text-sm font-semibold">{t(title)}</h1>
      </div>
      <p className="text-error text-xs font-normal">{t(message)}</p>
    </div>
  );
};
