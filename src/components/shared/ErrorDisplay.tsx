import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import Button from './Button';

interface ErrorDisplayProps {
  error: string;
  title?: string;
  onDismiss?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title = 'Error',
  onDismiss,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-md ${sizeClasses[size]} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className={`${iconSizes[size]} text-red-500`} />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-red-800 font-medium">{title}</h3>
          <p className="mt-1 text-red-700">{error}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
              >
                <span className="sr-only">Dismiss</span>
                <X className={iconSizes[size]} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;