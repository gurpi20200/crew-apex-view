import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'error' | 'excellent' | 'good' | 'warning' | 'critical';
  label?: string;
  showDot?: boolean;
  className?: string;
}

export function StatusIndicator({ 
  status, 
  label, 
  showDot = true, 
  className = "" 
}: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
      case 'excellent':
        return {
          color: 'bg-profit text-profit-foreground',
          dotColor: 'bg-profit',
          text: label || 'Connected'
        };
      case 'good':
        return {
          color: 'bg-profit/80 text-profit-foreground',
          dotColor: 'bg-profit/80',
          text: label || 'Good'
        };
      case 'warning':
        return {
          color: 'bg-warning text-warning-foreground',
          dotColor: 'bg-warning',
          text: label || 'Warning'
        };
      case 'error':
      case 'critical':
        return {
          color: 'bg-loss text-loss-foreground',
          dotColor: 'bg-loss',
          text: label || 'Error'
        };
      case 'disconnected':
        return {
          color: 'bg-muted text-muted-foreground',
          dotColor: 'bg-muted-foreground',
          text: label || 'Disconnected'
        };
      default:
        return {
          color: 'bg-muted text-muted-foreground',
          dotColor: 'bg-muted-foreground',
          text: label || 'Unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showDot && (
        <div className={cn("w-2 h-2 rounded-full animate-pulse", config.dotColor)} />
      )}
      <span className={cn("text-sm font-medium px-2 py-1 rounded-full", config.color)}>
        {config.text}
      </span>
    </div>
  );
}