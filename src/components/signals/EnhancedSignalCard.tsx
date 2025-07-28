import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RealTimeCounter } from "@/components/shared/RealTimeCounter";
import { TradingSignal } from "@/types/trading";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock, 
  Target, 
  Shield,
  BarChart3,
  Brain,
  Zap,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface EnhancedSignalCardProps {
  signal: TradingSignal;
  onExecute?: (signal: TradingSignal) => void;
  onViewDetails?: (signal: TradingSignal) => void;
  showTechnicalDetails?: boolean;
}

export function EnhancedSignalCard({ 
  signal, 
  onExecute, 
  onViewDetails,
  showTechnicalDetails = false 
}: EnhancedSignalCardProps) {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = signal.expiresAt.getTime();
      const remaining = expiry - now;

      if (remaining > 0) {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining("Expired");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [signal.expiresAt]);

  const getSignalIcon = () => {
    switch (signal.signalType) {
      case 'BUY':
        return <TrendingUp className="h-4 w-4" />;
      case 'SELL':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getSignalColor = () => {
    switch (signal.signalType) {
      case 'BUY':
        return 'profit';
      case 'SELL':
        return 'loss';
      default:
        return 'neutral';
    }
  };

  const getBorderColor = () => {
    switch (signal.signalType) {
      case 'BUY':
        return 'border-l-profit';
      case 'SELL':
        return 'border-l-loss';
      default:
        return 'border-l-neutral';
    }
  };

  const getConfidenceBand = () => {
    if (signal.confidence >= 90) return { color: 'bg-profit', label: 'Excellent' };
    if (signal.confidence >= 80) return { color: 'bg-profit/70', label: 'Strong' };
    if (signal.confidence >= 70) return { color: 'bg-warning', label: 'Good' };
    if (signal.confidence >= 60) return { color: 'bg-warning/70', label: 'Moderate' };
    return { color: 'bg-loss', label: 'Weak' };
  };

  const confidenceBand = getConfidenceBand();
  const urgencyLevel = signal.expiresAt.getTime() - Date.now() < 30 * 60 * 1000 ? 'high' : 'normal';

  return (
    <Card className={`trading-card border-l-4 ${getBorderColor()} ${urgencyLevel === 'high' ? 'animate-pulse' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              {signal.symbol}
              {urgencyLevel === 'high' && (
                <AlertTriangle className="h-4 w-4 text-warning animate-pulse" />
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{signal.companyName}</p>
          </div>
          <Badge 
            variant="secondary" 
            className={`${getSignalColor()}-text bg-${getSignalColor()}/10`}
          >
            {getSignalIcon()}
            {signal.signalType}
          </Badge>
        </div>
        
        {/* Strategy and AI Confidence */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            <span>{signal.strategy}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span className={`font-medium ${confidenceBand.color.replace('bg-', 'text-')}`}>
              {confidenceBand.label}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Confidence Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Confidence
            </span>
            <span className="font-medium">{signal.confidence}%</span>
          </div>
          <div className="relative">
            <Progress value={signal.confidence} className="h-3" />
            <div className={`absolute top-0 left-0 h-3 w-2 ${confidenceBand.color} rounded-l opacity-50`} />
          </div>
        </div>

        {/* Signal Strength with Visual Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Strength
            </span>
            <span className="font-medium">{signal.strength}/10</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-sm ${
                  i < signal.strength 
                    ? 'bg-profit' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Price Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" />
              Current
            </p>
            <p className="font-mono font-medium">
              <RealTimeCounter value={signal.currentPrice} prefix="$" decimals={2} />
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Target</p>
            <p className="font-mono font-medium">${signal.targetPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Risk/Reward and Timing */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">R/R Ratio</p>
            <p className="font-medium text-lg">{signal.riskReward.toFixed(1)}</p>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className={`text-xs ${urgencyLevel === 'high' ? 'text-warning font-medium' : ''}`}>
              {timeRemaining}
            </span>
          </div>
        </div>

        {/* Expandable Technical Details */}
        {showTechnicalDetails && (
          <>
            <Separator />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full"
            >
              Technical Analysis
              {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
            
            {isExpanded && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">RSI:</span>
                    <span className="ml-1 font-medium">{signal.technicalIndicators.rsi.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">MACD:</span>
                    <span className="ml-1 font-medium">{signal.technicalIndicators.macd.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">SMA20:</span>
                    <span className="ml-1 font-medium">${signal.technicalIndicators.sma20.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Volume:</span>
                    <span className="ml-1 font-medium">{signal.technicalIndicators.volumeRatio.toFixed(1)}x</span>
                  </div>
                </div>
                
                {signal.newssentiment && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sentiment:</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        signal.newssentiment > 0.7 ? 'bg-profit' :
                        signal.newssentiment > 0.3 ? 'bg-warning' : 'bg-loss'
                      }`} />
                      <span className="font-medium">{(signal.newssentiment * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1" 
            variant="default"
            onClick={() => onExecute?.(signal)}
          >
            Execute
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewDetails?.(signal)}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}