import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DataTable } from "@/components/shared/DataTable";
import { RealTimeCounter } from "@/components/shared/RealTimeCounter";
import { EnhancedSignalCard } from "@/components/signals/EnhancedSignalCard";
import { SignalPerformanceTracker } from "@/components/signals/SignalPerformanceTracker";
import { BatchSignalOperations } from "@/components/signals/BatchSignalOperations";
import { IntelligentSignalFilter } from "@/components/signals/IntelligentSignalFilter";
import { TradingSignal } from "@/types/trading";
import { mockTradingSignals } from "@/data/mockData";
import { TrendingUp, TrendingDown, Minus, Clock, Target, Shield, Brain, Zap } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/hooks/use-toast";

function SignalCard({ signal }: { signal: TradingSignal }) {
  const [timeRemaining, setTimeRemaining] = useState("");

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

  return (
    <Card className={`trading-card border-l-4 ${getBorderColor()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">{signal.symbol}</CardTitle>
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Strength</span>
            <span className="font-medium">{signal.strength}/10</span>
          </div>
          <Progress 
            value={signal.strength * 10} 
            className="h-2" 
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Confidence</span>
            <span className="font-medium">{signal.confidence}%</span>
          </div>
          <Progress 
            value={signal.confidence} 
            className="h-2" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Current</p>
            <p className="font-mono font-medium">
              <RealTimeCounter value={signal.currentPrice} prefix="$" decimals={2} />
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Target</p>
            <p className="font-mono font-medium">${signal.targetPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">R/R Ratio</p>
            <p className="font-medium">{signal.riskReward.toFixed(1)}</p>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{timeRemaining}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1" variant="default">
            Execute
          </Button>
          <Button size="sm" variant="outline">
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const signalColumns: ColumnDef<TradingSignal>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("symbol")}</div>
        <div className="text-sm text-muted-foreground">{row.original.companyName}</div>
      </div>
    ),
  },
  {
    accessorKey: "signalType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("signalType") as string;
      const getIcon = () => {
        switch (type) {
          case 'BUY': return <TrendingUp className="h-3 w-3" />;
          case 'SELL': return <TrendingDown className="h-3 w-3" />;
          default: return <Minus className="h-3 w-3" />;
        }
      };
      return (
        <Badge variant="secondary" className="gap-1">
          {getIcon()}
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "strategy",
    header: "Strategy",
  },
  {
    accessorKey: "strength",
    header: "Strength",
    cell: ({ row }) => (
      <div className="w-16">
        <Progress value={(row.getValue("strength") as number) * 10} className="h-2" />
        <span className="text-xs">{row.getValue("strength")}/10</span>
      </div>
    ),
  },
  {
    accessorKey: "confidence",
    header: "Confidence",
    cell: ({ row }) => `${row.getValue("confidence")}%`,
  },
  {
    accessorKey: "currentPrice",
    header: "Current",
    cell: ({ row }) => `$${(row.getValue("currentPrice") as number).toFixed(2)}`,
  },
  {
    accessorKey: "targetPrice",
    header: "Target",
    cell: ({ row }) => `$${(row.getValue("targetPrice") as number).toFixed(2)}`,
  },
  {
    accessorKey: "riskReward",
    header: "R/R",
    cell: ({ row }) => (row.getValue("riskReward") as number).toFixed(1),
  },
];

export default function TradingSignals() {
  const [signals] = useState<TradingSignal[]>(mockTradingSignals);
  const [filteredSignals, setFilteredSignals] = useState<TradingSignal[]>(signals);
  const [activeTab, setActiveTab] = useState<'signals' | 'performance' | 'batch'>('signals');

  // Mock performance data
  const [performanceData] = useState([
    {
      strategy: 'Momentum',
      totalSignals: 145,
      successRate: 68.5,
      avgReturn: 2.4,
      avgHoldTime: 4.2,
      lastWeekPerformance: 8.3,
      confidenceAccuracy: 82.1,
      bestPerformer: 'Momentum'
    },
    {
      strategy: 'Mean Reversion',
      totalSignals: 89,
      successRate: 72.1,
      avgReturn: 1.8,
      avgHoldTime: 6.1,
      lastWeekPerformance: 5.7,
      confidenceAccuracy: 79.5,
      bestPerformer: ''
    },
    {
      strategy: 'Breakout',
      totalSignals: 67,
      successRate: 58.2,
      avgReturn: 3.1,
      avgHoldTime: 2.8,
      lastWeekPerformance: 12.4,
      confidenceAccuracy: 75.8,
      bestPerformer: ''
    },
    {
      strategy: 'Sentiment',
      totalSignals: 112,
      successRate: 64.3,
      avgReturn: 1.9,
      avgHoldTime: 5.3,
      lastWeekPerformance: -2.1,
      confidenceAccuracy: 71.2,
      bestPerformer: ''
    }
  ]);

  const handleExecuteSignal = (signal: TradingSignal) => {
    toast({
      title: "Signal Execution",
      description: `Executing ${signal.signalType} signal for ${signal.symbol}`,
    });
  };

  const handleViewSignalDetails = (signal: TradingSignal) => {
    toast({
      title: "Signal Details",
      description: `Opening detailed analysis for ${signal.symbol}`,
    });
  };

  const handleBatchOperation = (signals: TradingSignal[], action: 'execute' | 'dismiss') => {
    toast({
      title: `Batch ${action === 'execute' ? 'Execution' : 'Dismissal'}`,
      description: `${action === 'execute' ? 'Executing' : 'Dismissing'} ${signals.length} signals`,
    });
  };

  const activeSignals = signals.filter(s => new Date() < s.expiresAt);
  const avgConfidence = signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length;
  const highConfidenceSignals = signals.filter(s => s.confidence >= 80).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Trading Signals</h1>
          <p className="text-muted-foreground">
            AI-powered trading opportunities with intelligent filtering and batch operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-profit rounded-full animate-pulse" />
            <span>Live AI Analysis</span>
          </div>
          <Button variant="destructive" size="sm">
            Emergency Stop
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2">
        <Button
          variant={activeTab === 'signals' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('signals')}
          className="flex items-center gap-2"
        >
          <Target className="h-4 w-4" />
          Live Signals
        </Button>
        <Button
          variant={activeTab === 'performance' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('performance')}
          className="flex items-center gap-2"
        >
          <Brain className="h-4 w-4" />
          Performance Analytics
        </Button>
        <Button
          variant={activeTab === 'batch' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('batch')}
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          Batch Operations
        </Button>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="trading-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Active Signals</span>
            </div>
            <p className="text-2xl font-bold text-profit">{activeSignals.length}</p>
            <p className="text-xs text-muted-foreground">+3 from last hour</p>
          </CardContent>
        </Card>
        <Card className="trading-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Avg Confidence</span>
            </div>
            <p className="text-2xl font-bold text-primary">{avgConfidence.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">AI Validated</p>
          </CardContent>
        </Card>
        <Card className="trading-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">High Confidence</span>
            </div>
            <p className="text-2xl font-bold text-profit">{highConfidenceSignals}</p>
            <p className="text-xs text-muted-foreground">80%+ confidence</p>
          </CardContent>
        </Card>
        <Card className="trading-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-profit">68.5%</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className="trading-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last Update</span>
            </div>
            <p className="text-sm font-medium">
              <RealTimeCounter value={Date.now()} />
            </p>
            <p className="text-xs text-muted-foreground">Real-time sync</p>
          </CardContent>
        </Card>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'signals' && (
        <>
          {/* Intelligent Filter */}
          <IntelligentSignalFilter
            signals={signals}
            onFilteredSignalsChange={setFilteredSignals}
            onCriteriaChange={() => {}}
          />

          {/* Enhanced Active Signals Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Live Trading Signals
              <Badge variant="secondary">{filteredSignals.length} signals</Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSignals.slice(0, 8).map((signal) => (
                <EnhancedSignalCard 
                  key={signal.id} 
                  signal={signal}
                  onExecute={handleExecuteSignal}
                  onViewDetails={handleViewSignalDetails}
                  showTechnicalDetails={true}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Signals Table */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Complete Signal Analysis</h2>
            <DataTable
              columns={signalColumns}
              data={filteredSignals}
              searchKey="symbol"
              pageSize={25}
            />
          </div>
        </>
      )}

      {activeTab === 'performance' && (
        <SignalPerformanceTracker data={performanceData} />
      )}

      {activeTab === 'batch' && (
        <div className="space-y-6">
          <BatchSignalOperations
            signals={filteredSignals}
            onExecuteBatch={handleBatchOperation}
            onFilterChange={() => {}}
          />
          
          {/* Batch Preview Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Signal Preview for Batch Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSignals.slice(0, 12).map((signal) => (
                <EnhancedSignalCard 
                  key={signal.id} 
                  signal={signal}
                  onExecute={handleExecuteSignal}
                  onViewDetails={handleViewSignalDetails}
                  showTechnicalDetails={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}