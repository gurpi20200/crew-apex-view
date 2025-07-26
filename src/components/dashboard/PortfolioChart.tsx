import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample portfolio data
const portfolioData = [
  { date: "2024-01-01", value: 100000, benchmark: 100000 },
  { date: "2024-01-07", value: 102500, benchmark: 101200 },
  { date: "2024-01-14", value: 105800, benchmark: 102800 },
  { date: "2024-01-21", value: 103200, benchmark: 101500 },
  { date: "2024-01-28", value: 108900, benchmark: 104200 },
  { date: "2024-02-04", value: 112300, benchmark: 106800 },
  { date: "2024-02-11", value: 115600, benchmark: 108500 },
  { date: "2024-02-18", value: 118200, benchmark: 110200 },
  { date: "2024-02-25", value: 121500, benchmark: 112600 },
  { date: "2024-03-03", value: 125000, benchmark: 115000 },
];

interface PortfolioChartProps {
  height?: number;
}

export function PortfolioChart({ height = 400 }: PortfolioChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Portfolio Performance (30 Days)
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Portfolio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
              <span>Benchmark</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={portfolioData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              className="text-xs"
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              className="text-xs"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={100000} stroke="#64748b" strokeDasharray="2 2" />
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke="rgb(100 116 139)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="rgb(59 130 246)"
              strokeWidth={3}
              dot={false}
              fill="url(#portfolioGradient)"
            />
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(59 130 246)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(59 130 246)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}