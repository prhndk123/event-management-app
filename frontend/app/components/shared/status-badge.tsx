import { TransactionStatus, getTransactionStatusLabel, getTransactionStatusColor } from '~/types';
import { cn } from '~/lib/utils';

interface StatusBadgeProps {
  status: TransactionStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = getTransactionStatusColor(status);
  const label = getTransactionStatusLabel(status);

  const colorClasses: Record<string, string> = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    info: 'bg-info/10 text-info border-info/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
    muted: 'bg-muted text-muted-foreground border-muted-foreground/20',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        colorClasses[color],
        className
      )}
    >
      {label}
    </span>
  );
}
