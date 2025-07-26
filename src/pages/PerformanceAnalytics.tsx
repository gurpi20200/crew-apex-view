import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable } from "@/components/shared/DataTable";
import { RealTimeCounter } from "@/components/shared/RealTimeCounter";
import { mockPerformanceMetrics, mockTrades, mockStrategies } from "@/data/mockData";
import { Trade } from "@/types/trading";
import { 
  TrendingUp, 
  Target, 
  Shield, 
  Award,
  Activity,
  Calendar,
  Download,
  BarChart3
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

function PerformanceChart({ type }: { type: string }) {
  const chartHeight = "h-64";
  
  const getChartContent = () => {
    switch (type) {
      case 'cumulative':
        return 'Cumulative Returns vs S&P 500 - Line chart showing portfolio performance vs benchmark';
      case 'monthly':
        return 'Monthly Returns Heatmap - Calendar view of monthly performance with color coding';
      case 'sharpe':
        return 'Rolling 30-Day Sharpe Ratio - Time series of risk-adjusted returns';
      case 'drawdown':
        return 'Drawdown Analysis - Underwater chart showing drawdown periods and recovery';
      case 'distribution':
        return 'Daily P&L Distribution - Histogram of daily returns with normal distribution overlay';
      case 'scatter':
        return 'Risk-Return Scatter - Portfolio positions plotted by risk vs return metrics';
      default:
        return 'Chart placeholder';
    }
  };

  return (
    <div className={`${chartHeight} flex items-center justify-center text-muted-foreground text-center p-4 border rounded-lg`}>
      {getChartContent()}
    </div>
  );
}

const tradeColumns: ColumnDef<Trade>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ row }) => (
      <span className="font-mono font-medium">{row.getValue("symbol")}</span>
    ),
  },
  {
    accessorKey: "side",
    header: "Side",
    cell: ({ row }) => {
      const side = row.getValue("side") as string;
      return (
        <Badge 
          variant={side === 'BUY' ? 'default' : 'secondary'}
          className={side === 'BUY' ? 'profit-text bg-profit/10' : 'loss-text bg-loss/10'}
        >
          {side}
        </Badge>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "entryPrice",
    header: "Entry Price",
    cell: ({ row }) => `$${(row.getValue("entryPrice") as number).toFixed(2)}`,
  },
  {
    accessorKey: "exitPrice",
    header: "Exit Price",
    cell: ({ row }) => {
      const price = row.getValue("exitPrice") as number | undefined;
      return price ? `$${price.toFixed(2)}` : 'Open';
    },
  },
  {
    accessorKey: "pnl",
    header: "P&L",
    cell: ({ row }) => {
      const pnl = row.getValue("pnl") as number;
      return (
        <span className={pnl >= 0 ? 'profit-text' : 'loss-text'}>
          ${pnl.toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: "pnlPercent",
    header: "P&L %",
    cell: ({ row }) => {
      const pnlPercent = row.getValue("pnlPercent") as number;
      return (
        <span className={pnlPercent >= 0 ? 'profit-text' : 'loss-text'}>
          {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
        </span>
      );
    },
  },
  {
    accessorKey: "strategy",
    header: "Strategy",
  },
];

function StrategyPerformanceTable() {
  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle>Strategy Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Strategy</th>
                <th className="text-right p-2">Allocation</th>
                <th className="text-right p-2">Total Return</th>
                <th className="text-right p-2">Sharpe</th>
                <th className="text-right p-2">Max DD</th>
                <th className="text-right p-2">Win Rate</th>
                <th className="text-right p-2">30D Return</th>
              </tr>
            </thead>
            <tbody>
              {mockStrategies.map(strategy => (
                <tr key={strategy.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${strategy.isActive ? 'bg-profit' : 'bg-muted'}`} />
                      <span className="font-medium">{strategy.name}</span>
                    </div>
                  </td>
                  <td className="text-right p-2">{strategy.allocation}%</td>
                  <td className="text-right p-2 profit-text">
                    +{strategy.performance.totalReturn.toFixed(1)}%
                  </td>
                  <td className="text-right p-2">{strategy.performance.sharpe.toFixed(2)}</td>
                  <td className="text-right p-2 loss-text">
                    {strategy.performance.maxDrawdown.toFixed(1)}%
                  </td>
                  <td className="text-right p-2">{strategy.performance.winRate}%</td>
                  <td className="text-right p-2 profit-text">+5.2%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PerformanceAnalytics() {
  const [timeframe, setTimeframe] = useState("YTD");
  const metrics = mockPerformanceMetrics;

  const bestTrades = mockTrades
    .filter(t => t.pnl > 0)
    .sort((a, b) => b.pnl - a.pnl)
    .slice(0, 3);

  const worstTrades = mockTrades
    .filter(t => t.pnl < 0)
    .sort((a, b) => a.pnl - b.pnl)
    .slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of trading performance and strategy effectiveness
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1 Day</SelectItem>
              <SelectItem value="1W">1 Week</SelectItem>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="YTD">Year to Date</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Total Return"
          value={`${metrics.totalReturn.toFixed(1)}%`}
          change="+2.3%"
          changePercent={2.3}
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          title="Annualized Return"
          value={`${metrics.annualizedReturn.toFixed(1)}%`}
          icon={Target}
          trend="up"
        />
        <MetricCard
          title="Sharpe Ratio"
          value={metrics.sharpeRatio.toFixed(2)}
          icon={Award}
          trend="up"
        />
        <MetricCard
          title="Max Drawdown"
          value={`${metrics.maxDrawdown.toFixed(1)}%`}
          icon={TrendingUp}
          trend="down"
        />
        <MetricCard
          title="Win Rate"
          value={`${metrics.winRate.toFixed(1)}%`}
          icon={Target}
          trend="up"
        />
        <MetricCard
          title="Total Trades"
          value={metrics.totalTrades}
          icon={Activity}
          trend="neutral"
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cumulative Returns vs Benchmark
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart type="cumulative" />
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Returns Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart type="monthly" />
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader>
            <CardTitle>Rolling Sharpe Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart type="sharpe" />
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader>
            <CardTitle>Drawdown Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart type="drawdown" />
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader>
            <CardTitle>Daily P&L Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart type="distribution" />
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader>
            <CardTitle>Risk-Return Scatter</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart type="scatter" />
          </CardContent>
        </Card>
      </div>

      {/* Strategy Performance */}
      <StrategyPerformanceTable />

      {/* Trade Analysis */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Trades</TabsTrigger>
            <TabsTrigger value="best">Best Trades</TabsTrigger>
            <TabsTrigger value="worst">Worst Trades</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={tradeColumns}
                data={mockTrades}
                searchKey="symbol"
                pageSize={20}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle>Best Performing Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={tradeColumns}
                data={bestTrades}
                showPagination={false}
                showSearch={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="worst">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle>Worst Performing Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={tradeColumns}
                data={worstTrades}
                showPagination={false}
                showSearch={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Avg Win"
              value={`$${metrics.avgWin.toFixed(2)}`}
              icon={TrendingUp}
              trend="up"
            />
            <MetricCard
              title="Avg Loss"
              value={`$${Math.abs(metrics.avgLoss).toFixed(2)}`}
              icon={TrendingUp}
              trend="down"
            />
            <MetricCard
              title="Profit Factor"
              value={metrics.profitFactor.toFixed(2)}
              icon={Target}
              trend="up"
            />
            <MetricCard
              title="Avg Holding Period"
              value={`${metrics.avgHoldingPeriod.toFixed(1)} days`}
              icon={Activity}
              trend="neutral"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}