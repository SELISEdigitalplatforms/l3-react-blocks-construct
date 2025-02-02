import React, { useState, useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';

interface ErrorAlertProps {
  isError: boolean;
  title?: string;
  message?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  isError,
  title = 'Error',
  message = 'An error occurred.',
}) => {
  const [isVisible, setIsVisible] = useState(false);

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
        <h1 className="text-error text-sm font-semibold">{title}</h1>
      </div>
      <p className="text-error text-xs font-normal">{message}</p>
    </div>
  );
};

export default ErrorAlert;
