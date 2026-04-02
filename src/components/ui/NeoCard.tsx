import React from 'react';
import { cn } from '@/lib/utils';

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'primary' | 'accent';
  noShadow?: boolean;
}

export const NeoCard = ({ 
  className, 
  variant = 'white', 
  noShadow = false, 
  children, 
  ...props 
}: NeoCardProps) => {
  const variants = {
    white: 'bg-white',
    primary: 'bg-primary',
    accent: 'bg-accent text-white',
  };

  return (
    <div
      className={cn(
        'border-neo rounded-2xl p-4',
        !noShadow && 'shadow-neo',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
