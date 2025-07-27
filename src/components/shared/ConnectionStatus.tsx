import { useEffect, useState } from 'react';
import { Wifi, WifiOff, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { WebSocketStatus } from '@/hooks/useWebSocket';

interface ConnectionStatusProps {
  status: WebSocketStatus;
  latency?: number;
  lastUpdate?: Date | null;
  className?: string;
  showDetails?: boolean;
}

export function ConnectionStatus({ 
  status, 
  latency = 0, 
  lastUpdate, 
  className,
  showDetails = true 
}: ConnectionStatusProps) {
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>('');

  useEffect(() => {
    if (!lastUpdate) return;

    const updateTimer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - lastUpdate.getTime();
      const seconds = Math.floor(diff / 1000);
      
      if (seconds < 60) {
        setTimeSinceUpdate(`${seconds}s ago`);
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeSinceUpdate(`${minutes}m ago`);
      } else {
        const hours = Math.floor(seconds / 3600);
        setTimeSinceUpdate(`${hours}h ago`);
      }
    }, 1000);

    return () => clearInterval(updateTimer);
  }, [lastUpdate]);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          color: 'bg-profit text-profit-foreground',
          dotColor: 'bg-profit',
          text: 'Connected',
          pulse: false
        };
      case 'connecting':
        return {
          icon: Clock,
          color: 'bg-warning text-warning-foreground',
          dotColor: 'bg-warning',
          text: 'Connecting',
          pulse: true
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          color: 'bg-muted text-muted-foreground',
          dotColor: 'bg-muted-foreground',
          text: 'Disconnected',
          pulse: false
        };
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'bg-loss text-loss-foreground',
          dotColor: 'bg-loss',
          text: 'Error',
          pulse: true
        };
      default:
        return {
          icon: WifiOff,
          color: 'bg-muted text-muted-foreground',
          dotColor: 'bg-muted-foreground',
          text: 'Unknown',
          pulse: false
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const getLatencyColor = () => {
    if (latency < 100) return 'text-profit';
    if (latency < 300) return 'text-warning';
    return 'text-loss';
  };

  const statusContent = (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-2">
        <div 
          className={cn(
            "w-2 h-2 rounded-full",
            config.dotColor,
            config.pulse && "animate-pulse"
          )} 
        />
        <Icon className="h-4 w-4" />
        {showDetails && (
          <Badge variant="secondary" className={config.color}>
            {config.text}
          </Badge>
        )}
      </div>
      
      {showDetails && status === 'connected' && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className={cn("font-mono", getLatencyColor())}>
            {latency}ms
          </span>
          {lastUpdate && (
            <span>{timeSinceUpdate}</span>
          )}
        </div>
      )}
    </div>
  );

  if (!showDetails) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {statusContent}
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <div className="font-medium">{config.text}</div>
            {status === 'connected' && (
              <div className="text-xs text-muted-foreground mt-1">
                Latency: {latency}ms
                {lastUpdate && <div>Last update: {timeSinceUpdate}</div>}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return statusContent;
}