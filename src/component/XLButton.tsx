import React from 'react';

// Define specific types untuk variant dan size
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface XLButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  // ... tambahkan props HTML button lainnya sesuai kebutuhan
}

const XLButton: React.FC<XLButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = 'font-xl font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-xl-primary text-xl-accent hover:bg-red-600 focus:ring-xl-primary',
    secondary: 'bg-xl-secondary text-xl-accent hover:bg-gray-800 focus:ring-xl-secondary',
    outline: 'border-2 border-xl-primary text-xl-primary hover:bg-xl-primary hover:text-xl-accent',
    ghost: 'text-xl-primary hover:bg-red-50',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedClassName = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default XLButton;
