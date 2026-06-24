import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  padding?: boolean;
}

export function Card({ children, onClick, className, padding = true }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-gray-100',
        onClick && 'cursor-pointer active:bg-gray-50 transition-colors',
        padding && 'p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
