import { cn } from '@/utils/cn';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', size = 'md', fullWidth, disabled, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
        variant === 'secondary' && 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
        variant === 'ghost' && 'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
        size === 'sm' && 'px-3 py-1.5 text-sm gap-1.5',
        size === 'md' && 'px-5 py-2.5 text-sm gap-2',
        size === 'lg' && 'px-6 py-3.5 text-base gap-2',
        fullWidth && 'w-full',
      )}
    >
      {children}
    </button>
  );
}
