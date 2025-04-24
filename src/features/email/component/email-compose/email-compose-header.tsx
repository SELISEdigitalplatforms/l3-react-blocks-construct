import { Minus, X, Expand, Minimize2 } from 'lucide-react';
import { Button } from 'components/ui/button';

/**
 * EmailComposeHeader component renders the header section of the email compose window.
 * It includes buttons for minimizing, maximizing, and closing the window.
 *
 * @component
 *
 * @param {Object} props - The props for the component.
 * @param {function} [props.onMinimize] - An optional callback function to minimize the email compose window.
 * @param {function} [props.onMaximize] - An optional callback function to maximize the email compose window.
 * @param {function} [props.onClose] - An optional callback function to close the email compose window.
 *
 * @returns {JSX.Element} - The header UI of the email compose modal.
 *
 * @example
 * const handleMinimize = () => { console.log('Minimized'); };
 * const handleMaximize = () => { console.log('Maximized'); };
 * const handleClose = () => { console.log('Closed'); };
 * <EmailComposeHeader onMinimize={handleMinimize} onMaximize={handleMaximize} onClose={handleClose} />
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
  return (
    <div className="hidden md:flex items-center bg-surface justify-between  rounded-t px-3 py-2 ">
      <div className="font-medium  text-medium-emphasis">New message</div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMinimize}>
          <Minus className="h-4 w-4" />
          <span className="sr-only">Minimize</span>
        </Button>
        {!isMaximized && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMaximize}>
            <Expand className="h-4 w-4" />
            <span className="sr-only">Maximize</span>
          </Button>
        )}
        {isMaximized && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMaximize}>
            <Minimize2 className="h-4 w-4" />
            <span className="sr-only">Maximize</span>
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  );
}
