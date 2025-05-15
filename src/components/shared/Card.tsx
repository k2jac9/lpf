import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  border = true,
  shadow = 'md',
  rounded = 'md',
  hover = false,
}) => {
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };
  
  // Border classes
  const borderClasses = border ? 'border border-gray-200' : '';
  
  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };
  
  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  // Hover classes
  const hoverClasses = hover ? 'transition-all duration-200 hover:shadow-lg hover:border-primary-200' : '';
  
  // Combine classes
  const cardClasses = `
    bg-white
    ${paddingClasses[padding]}
    ${borderClasses}
    ${shadowClasses[shadow]}
    ${roundedClasses[rounded]}
    ${hoverClasses}
    ${className}
  `;
  
  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};

export default Card;