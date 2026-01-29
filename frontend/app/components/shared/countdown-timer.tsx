import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '~/lib/utils';

interface CountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
  className?: string;
}

export function CountdownTimer({ expiresAt, onExpire, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(expiresAt).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.expired && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  if (timeLeft.expired) {
    return (
      <div className={cn("flex items-center gap-2 text-destructive", className)}>
        <Clock className="h-4 w-4" />
        <span className="font-medium">Time Expired</span>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Clock className="h-4 w-4 text-warning" />
      <div className="flex items-center gap-1 font-mono font-medium">
        <span className="bg-warning/10 text-warning px-2 py-1 rounded">
          {formatNumber(timeLeft.hours)}
        </span>
        <span className="text-muted-foreground">:</span>
        <span className="bg-warning/10 text-warning px-2 py-1 rounded">
          {formatNumber(timeLeft.minutes)}
        </span>
        <span className="text-muted-foreground">:</span>
        <span className="bg-warning/10 text-warning px-2 py-1 rounded">
          {formatNumber(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
}
