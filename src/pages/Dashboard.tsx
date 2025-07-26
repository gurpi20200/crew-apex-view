import { useState, useEffect } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Activity,
  Users,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import tradingHero from "@/assets/trading-hero.jpg";

interface DashboardMetrics {
  totalPortfolioValue: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  activePositions: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPortfolioValue: 125000,
    dailyPnL: 2500,
    dailyPnLPercent: 2.04,
    totalReturn: 25000,
    totalReturnPercent: 25.0,
    sharpeRatio: 1.8,
    maxDrawdown: -8.5,
    winRate: 68.5,
    totalTrades: 247,
    activePositions: 12,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        dailyPnL: prev.dailyPnL + (Math.random() - 0.5) * 100,
        dailyPnLPercent: prev.dailyPnLPercent + (Math.random() - 0.5) * 0.1,
        totalPortfolioValue: prev.totalPortfolioValue + (Math.random() - 0.5) * 500,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const recentActivity = [
    {
      id: 1,
      type: "trade",
      symbol: "AAPL",
      action: "BUY",
      quantity: 100,
      price: 185.25,
      time: "2 minutes ago",
      status: "executed",
    },
    {
      id: 2,
      type: "signal",
      symbol: "TSLA",
      action: "SELL",
      confidence: 92,
      time: "5 minutes ago",
      status: "pending",
    },
    {
      id: 3,
      type: "alert",
      message: "Portfolio drawdown reached 3.2%",
      time: "8 minutes ago",
      status: "warning",
    },
    {
      id: 4,
      type: "trade",
      symbol: "MSFT",
      action: "SELL",
      quantity: 50,
      price: 412.80,
      time: "12 minutes ago",
      status: "executed",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "executed":
        return <Badge variant="secondary" className="bg-success/10 text-success">Executed</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning/10 text-warning">Pending</Badge>;
      case "warning":
        return <Badge variant="destructive">Warning</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-32 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${tradingHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/60" />
        <div className="relative flex h-full items-center px-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Trading Dashboard</h1>
            <p className="text-muted-foreground">Real-time portfolio monitoring and trading insights</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Portfolio Value"
            value={metrics.totalPortfolioValue}
            change={`$${metrics.dailyPnL.toFixed(0)}`}
            changePercent={metrics.dailyPnLPercent}
            icon={DollarSign}
            trend={metrics.dailyPnL >= 0 ? "up" : "down"}
          />
          
          <MetricCard
            title="Total Return"
            value={`$${metrics.totalReturn.toLocaleString()}`}
            changePercent={metrics.totalReturnPercent}
            icon={TrendingUp}
            trend="up"
          />
          
          <MetricCard
            title="Sharpe Ratio"
            value={metrics.sharpeRatio.toFixed(2)}
            icon={Target}
            trend={metrics.sharpeRatio > 1 ? "up" : "neutral"}
          />
          
          <MetricCard
            title="Win Rate"
            value={`${metrics.winRate.toFixed(1)}%`}
            icon={Activity}
            trend={metrics.winRate > 60 ? "up" : "neutral"}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Max Drawdown"
            value={`${metrics.maxDrawdown.toFixed(1)}%`}
            icon={TrendingDown}
            trend="down"
          />
          
          <MetricCard
            title="Total Trades"
            value={metrics.totalTrades}
            icon={Users}
            trend="neutral"
          />
          
          <MetricCard
            title="Active Positions"
            value={metrics.activePositions}
            icon={CheckCircle}
            trend="neutral"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PortfolioChart />
          </div>

          {/* Recent Activity */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    {activity.type === "trade" && (
                      <div>
                        <div className="font-medium text-sm">
                          {activity.action} {activity.quantity} {activity.symbol}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          @ ${activity.price} • {activity.time}
                        </div>
                      </div>
                    )}
                    {activity.type === "signal" && (
                      <div>
                        <div className="font-medium text-sm">
                          Signal: {activity.action} {activity.symbol}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Confidence: {activity.confidence}% • {activity.time}
                        </div>
                      </div>
                    )}
                    {activity.type === "alert" && (
                      <div>
                        <div className="font-medium text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          Risk Alert
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.message} • {activity.time}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}