import React from 'react';
import { cn } from '@/lib/utils';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-black hover:bg-yellow-400',
      accent: 'bg-accent text-white hover:bg-red-500',
      outline: 'bg-white text-black hover:bg-gray-50',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      icon: 'p-3',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'border-neo shadow-neo active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-2xl font-bold flex items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

NeoButton.displayName = 'NeoButton';
