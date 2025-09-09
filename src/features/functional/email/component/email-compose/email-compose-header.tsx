import { useTranslation } from 'react-i18next';
import { Minus, X, Expand, Minimize2 } from 'lucide-react';
import { Button } from 'components/ui/button';

/**
 * EmailComposeHeader Component
 *
 * A reusable header component for the email compose modal.
 * This component supports:
 * - Minimizing the email compose window
 * - Maximizing/restoring the email compose window
 * - Closing the email compose window
 *
 * Features:
 * - Provides buttons for minimizing, maximizing, and closing the modal
 * - Dynamically switches between maximize and restore icons based on the current state
 * - Accessible with screen reader-friendly labels
 *
 * Props:
 * @param {() => void} [onMinimize] - Callback triggered when the minimize button is clicked
 * @param {() => void} [onMaximize] - Callback triggered when the maximize/restore button is clicked
 * @param {() => void} [onClose] - Callback triggered when the close button is clicked
 * @param {boolean} isMaximized - Whether the email compose window is currently maximized
 *
 * @returns {JSX.Element} The header UI of the email compose modal
 *
 * @example
 * // Basic usage
 * <EmailComposeHeader
 *   onMinimize={() => console.log('Minimized')}
 *   onMaximize={() => console.log('Maximized')}
 *   onClose={() => console.log('Closed')}
 *   isMaximized={false}
 * />
 */

interface EmailComposeHeaderProps {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  isMaximized: boolean;
}

export function EmailComposeHeader({
  onMinimize,
  onMaximize,
  onClose,
  isMaximized,
}: Readonly<EmailComposeHeaderProps>) {
  const { t } = useTranslation();

  return (
    <div className="hidden md:flex items-center bg-surface justify-between rounded-t px-3 py-2 ">
      <div className="font-medium  text-medium-emphasis">{t('NEW_MESSAGE')}</div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMinimize}>
          <Minus className="h-4 w-4" />
          <span className="sr-only">{t('MINIMIZE')}</span>
        </Button>
        {!isMaximized && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMaximize}>
            <Expand className="h-4 w-4" />
            <span className="sr-only">{t('MAXIMIZE')}</span>
          </Button>
        )}
        {isMaximized && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMaximize}>
            <Minimize2 className="h-4 w-4" />
            <span className="sr-only">{t('MAXIMIZE')}</span>
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">{t('CLOSE')}</span>
        </Button>
      </div>
    </div>
  );
}
