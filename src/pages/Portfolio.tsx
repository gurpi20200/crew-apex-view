import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, MoreHorizontal } from "lucide-react";

const positions = [
  {
    symbol: "AAPL",
    quantity: 100,
    avgPrice: 180.25,
    currentPrice: 185.30,
    marketValue: 18530,
    unrealizedPnL: 505,
    unrealizedPnLPercent: 2.80,
    dayChange: 2.15,
    dayChangePercent: 1.17,
    weight: 14.8,
    entryDate: "2024-02-15",
    strategy: "Momentum",
  },
  {
    symbol: "MSFT",
    quantity: 50,
    avgPrice: 405.80,
    currentPrice: 412.90,
    marketValue: 20645,
    unrealizedPnL: 355,
    unrealizedPnLPercent: 1.75,
    dayChange: -1.20,
    dayChangePercent: -0.29,
    weight: 16.5,
    entryDate: "2024-02-10",
    strategy: "Value",
  },
  {
    symbol: "GOOGL",
    quantity: 75,
    avgPrice: 142.50,
    currentPrice: 145.80,
    marketValue: 10935,
    unrealizedPnL: 247.50,
    unrealizedPnLPercent: 2.32,
    dayChange: 0.85,
    dayChangePercent: 0.59,
    weight: 8.7,
    entryDate: "2024-02-20",
    strategy: "Growth",
  },
  {
    symbol: "TSLA",
    quantity: 80,
    avgPrice: 248.90,
    currentPrice: 245.30,
    marketValue: 19624,
    unrealizedPnL: -288,
    unrealizedPnLPercent: -1.45,
    dayChange: -3.60,
    dayChangePercent: -1.45,
    weight: 15.7,
    entryDate: "2024-01-25",
    strategy: "Momentum",
  },
];

const allocationData = [
  { name: "Technology", value: 45.2, fill: "rgb(59 130 246)" },
  { name: "Healthcare", value: 18.5, fill: "rgb(34 197 94)" },
  { name: "Finance", value: 15.8, fill: "rgb(168 85 247)" },
  { name: "Consumer", value: 12.3, fill: "rgb(245 158 11)" },
  { name: "Energy", value: 8.2, fill: "rgb(239 68 68)" },
];

const performanceData = [
  { month: "Jan", return: 2.5, benchmark: 1.8 },
  { month: "Feb", return: 4.2, benchmark: 2.9 },
  { month: "Mar", return: -1.8, benchmark: -0.5 },
  { month: "Apr", return: 3.7, benchmark: 2.1 },
  { month: "May", return: 5.1, benchmark: 3.4 },
  { month: "Jun", return: 2.9, benchmark: 2.2 },
];

export default function Portfolio() {
  const [sortBy, setSortBy] = useState<string>("weight");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
  const totalPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
  const totalPnLPercent = (totalPnL / (totalValue - totalPnL)) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? "+" : "";
    return `${sign}${percent.toFixed(2)}%`;
  };

  const sortedPositions = [...positions].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return sortOrder === "asc" 
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  return (
    <div className="p-6 space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="trading-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="trading-label">Total Portfolio Value</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="trading-metric">{formatCurrency(totalValue)}</div>
            <div className={`text-sm font-medium ${totalPnL >= 0 ? "profit-text" : "loss-text"}`}>
              {formatCurrency(totalPnL)} ({formatPercent(totalPnLPercent)})
            </div>
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="trading-label">Active Positions</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="trading-metric">{positions.length}</div>
            <div className="text-sm text-muted-foreground">
              {positions.filter(p => p.unrealizedPnL > 0).length} profitable
            </div>
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="trading-label">Best Performer</CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="trading-metric">
              {positions.reduce((best, pos) => 
                pos.unrealizedPnLPercent > best.unrealizedPnLPercent ? pos : best
              ).symbol}
            </div>
            <div className="text-sm profit-text">
              {formatPercent(Math.max(...positions.map(p => p.unrealizedPnLPercent)))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <Card className="trading-card">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Allocation"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.fill }}
                  />
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Performance */}
        <Card className="trading-card">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis tickFormatter={(value) => `${value}%`} className="text-xs" />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, ""]}
                  labelFormatter={(label) => `${label} 2024`}
                />
                <Bar dataKey="benchmark" fill="rgb(148 163 184)" name="Benchmark" />
                <Bar dataKey="return" fill="rgb(59 130 246)" name="Portfolio" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Positions Table */}
      <Card className="trading-card">
        <CardHeader>
          <CardTitle>Current Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium">Symbol</th>
                  <th className="text-right p-3 font-medium">Quantity</th>
                  <th className="text-right p-3 font-medium">Avg Price</th>
                  <th className="text-right p-3 font-medium">Current</th>
                  <th className="text-right p-3 font-medium">Market Value</th>
                  <th className="text-right p-3 font-medium">P&L</th>
                  <th className="text-right p-3 font-medium">Day Change</th>
                  <th className="text-right p-3 font-medium">Weight</th>
                  <th className="text-center p-3 font-medium">Strategy</th>
                  <th className="text-center p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPositions.map((position) => (
                  <tr key={position.symbol} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="font-medium font-mono">{position.symbol}</div>
                    </td>
                    <td className="p-3 text-right font-mono">{position.quantity}</td>
                    <td className="p-3 text-right font-mono">{formatCurrency(position.avgPrice)}</td>
                    <td className="p-3 text-right font-mono">{formatCurrency(position.currentPrice)}</td>
                    <td className="p-3 text-right font-mono">{formatCurrency(position.marketValue)}</td>
                    <td className="p-3 text-right">
                      <div className={`font-mono ${position.unrealizedPnL >= 0 ? "profit-text" : "loss-text"}`}>
                        {formatCurrency(position.unrealizedPnL)}
                      </div>
                      <div className={`text-xs ${position.unrealizedPnL >= 0 ? "profit-text" : "loss-text"}`}>
                        {formatPercent(position.unrealizedPnLPercent)}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className={`font-mono ${position.dayChange >= 0 ? "profit-text" : "loss-text"}`}>
                        {formatCurrency(position.dayChange)}
                      </div>
                      <div className={`text-xs ${position.dayChange >= 0 ? "profit-text" : "loss-text"}`}>
                        {formatPercent(position.dayChangePercent)}
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono">{position.weight.toFixed(1)}%</td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className="text-xs">
                        {position.strategy}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}