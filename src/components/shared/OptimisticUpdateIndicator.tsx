import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface OptimisticUpdateIndicatorProps {
  pendingCount: number;
  className?: string;
}

export function OptimisticUpdateIndicator({ 
  pendingCount, 
  className 
}: OptimisticUpdateIndicatorProps) {
  if (pendingCount === 0) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-1", className)}>
            <CheckCircle className="h-3 w-3 text-profit" />
            <span className="text-xs text-muted-foreground">Synced</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <span>All updates synchronized</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("flex items-center gap-1", className)}>
          <Clock className="h-3 w-3 text-warning animate-pulse" />
          <Badge variant="outline" className="h-5 text-xs bg-warning/10 text-warning-foreground border-warning/20">
            {pendingCount}
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span>{pendingCount} update{pendingCount > 1 ? 's' : ''} pending</span>
      </TooltipContent>
    </Tooltip>
  );
}