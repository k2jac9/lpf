import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  ...props
}) => {
  // Base classes for all variants
  const baseClasses = "inline-flex items-center justify-center border font-medium rounded-md focus:outline-none transition-colors duration-200";
  
  // Size-specific classes
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary-500 text-white border-transparent hover:bg-primary-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
    secondary: 'bg-secondary-500 text-white border-transparent hover:bg-secondary-600 focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500',
    outline: 'bg-white text-primary-500 border-primary-500 hover:bg-primary-50 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
    danger: 'bg-error-500 text-white border-transparent hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-error-500',
    success: 'bg-success-500 text-white border-transparent hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-success-500',
    text: 'bg-transparent text-primary-500 border-transparent hover:bg-primary-50 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-none',
  };
  
  // Disabled classes
  const disabledClasses = "opacity-50 cursor-not-allowed";
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled || isLoading ? disabledClasses : ''}
    ${widthClasses}
    ${className || ''}
  `;

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;