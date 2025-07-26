import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { DataTable } from "@/components/shared/DataTable";
import { RealTimeCounter } from "@/components/shared/RealTimeCounter";
import { TradingSignal } from "@/types/trading";
import { mockTradingSignals } from "@/data/mockData";
import { TrendingUp, TrendingDown, Minus, Clock, Target, Shield, Search, Filter } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

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
        <Progress value={row.getValue("strength") * 10} className="h-2" />
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
  const [signalTypeFilter, setSignalTypeFilter] = useState<string>("all");
  const [strategyFilter, setStrategyFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let filtered = signals;

    if (signalTypeFilter !== "all") {
      filtered = filtered.filter(signal => signal.signalType === signalTypeFilter);
    }

    if (strategyFilter !== "all") {
      filtered = filtered.filter(signal => signal.strategy === strategyFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(signal => 
        signal.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSignals(filtered);
  }, [signals, signalTypeFilter, strategyFilter, searchTerm]);

  const activeSignals = signals.filter(s => new Date() < s.expiresAt);
  const avgConfidence = signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trading Signals</h1>
          <p className="text-muted-foreground">
            Real-time trading opportunities across all strategies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-profit rounded-full animate-pulse" />
            <span>Live</span>
          </div>
          <Button variant="destructive" size="sm">
            Emergency Stop
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="trading-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Active Signals</span>
            </div>
            <p className="text-2xl font-bold">{activeSignals.length}</p>
          </CardContent>
        </Card>
        <Card className="trading-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Avg Confidence</span>
            </div>
            <p className="text-2xl font-bold">{avgConfidence.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card className="trading-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Best Strategy</span>
            </div>
            <p className="text-lg font-bold">Momentum</p>
          </CardContent>
        </Card>
        <Card className="trading-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last Update</span>
            </div>
            <p className="text-sm">2 minutes ago</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="trading-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search symbols..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
            </div>
            <Select value={signalTypeFilter} onValueChange={setSignalTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Signal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BUY">BUY</SelectItem>
                <SelectItem value="SELL">SELL</SelectItem>
                <SelectItem value="HOLD">HOLD</SelectItem>
              </SelectContent>
            </Select>
            <Select value={strategyFilter} onValueChange={setStrategyFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strategies</SelectItem>
                <SelectItem value="Momentum">Momentum</SelectItem>
                <SelectItem value="Mean Reversion">Mean Reversion</SelectItem>
                <SelectItem value="Breakout">Breakout</SelectItem>
                <SelectItem value="Sentiment">Sentiment</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSignalTypeFilter("all");
                setStrategyFilter("all");
                setSearchTerm("");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Signals Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Signals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSignals.slice(0, 8).map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </div>

      {/* Detailed Signals Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Signals</h2>
        <DataTable
          columns={signalColumns}
          data={filteredSignals}
          searchKey="symbol"
          pageSize={25}
        />
      </div>
    </div>
  );
}