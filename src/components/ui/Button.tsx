import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 touch-manipulation';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 shadow-lg',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400 shadow-md',
    ghost: 'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400'
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm min-w-[2rem]',
    md: 'h-10 px-4 py-2 min-w-[2.5rem]',
    lg: 'h-12 px-6 text-lg min-w-[3rem]',
    icon: 'h-10 w-10 min-h-[2.5rem] min-w-[2.5rem]'
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};