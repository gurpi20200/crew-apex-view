import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Brush,
  ReferenceLine,
  Scatter
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';

interface VaRData {
  date: string;
  portfolioValue: number;
  var95: number;
  var99: number;
  expectedShortfall: number;
  actualPnL: number;
  confidence: number;
}

interface InteractiveVaRDashboardProps {
  varData: VaRData[];
  currentVaR: {
    var95: number;
    var99: number;
    expectedShortfall: number;
    confidence: number;
  };
}

const chartConfig = {
  var95: {
    label: "95% VaR",
    color: "hsl(var(--chart-1))",
  },
  var99: {
    label: "99% VaR", 
    color: "hsl(var(--chart-2))",
  },
  expectedShortfall: {
    label: "Expected Shortfall",
    color: "hsl(var(--chart-3))",
  },
  actualPnL: {
    label: "Actual P&L",
    color: "hsl(var(--chart-4))",
  },
  portfolioValue: {
    label: "Portfolio Value",
    color: "hsl(var(--chart-5))",
  }
};

export const InteractiveVaRDashboard = ({ 
  varData, 
  currentVaR 
}: InteractiveVaRDashboardProps) => {
  const [confidenceLevel, setConfidenceLevel] = useState([95]);
  const [timeHorizon, setTimeHorizon] = useState([1]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return varData.slice(-30); // Last 30 days
  }, [varData]);

  const backtestResults = useMemo(() => {
    const violations95 = varData.filter(d => d.actualPnL < d.var95).length;
    const violations99 = varData.filter(d => d.actualPnL < d.var99).length;
    const total = varData.length;
    
    return {
      var95Accuracy: ((total - violations95) / total * 100).toFixed(1),
      var99Accuracy: ((total - violations99) / total * 100).toFixed(1),
      violations95,
      violations99,
      total
    };
  }, [varData]);

  const scenarios = [
    { name: "Market Crash (-20%)", impact: -0.2, probability: 0.02 },
    { name: "Flash Crash (-10%)", impact: -0.1, probability: 0.05 },
    { name: "Volatility Spike", impact: -0.15, probability: 0.08 },
    { name: "Interest Rate Shock", impact: -0.08, probability: 0.12 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Interactive VaR Dashboard
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {confidenceLevel[0]}% Confidence
              </Badge>
              <Badge variant="outline">
                {timeHorizon[0]} Day Horizon
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-1 space-y-4">
              <div>
                <Label>Confidence Level (%)</Label>
                <Slider
                  value={confidenceLevel}
                  onValueChange={setConfidenceLevel}
                  max={99}
                  min={90}
                  step={1}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground mt-1">
                  {confidenceLevel[0]}%
                </div>
              </div>
              
              <div>
                <Label>Time Horizon (Days)</Label>
                <Slider
                  value={timeHorizon}
                  onValueChange={setTimeHorizon}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground mt-1">
                  {timeHorizon[0]} day{timeHorizon[0] > 1 ? 's' : ''}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Stress Scenarios</Label>
                {scenarios.map((scenario) => (
                  <Button
                    key={scenario.name}
                    variant={selectedScenario === scenario.name ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => setSelectedScenario(
                      selectedScenario === scenario.name ? null : scenario.name
                    )}
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {scenario.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <Tabs defaultValue="timeseries" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="timeseries">Time Series</TabsTrigger>
                  <TabsTrigger value="distribution">Distribution</TabsTrigger>
                  <TabsTrigger value="backtest">Backtest</TabsTrigger>
                </TabsList>
                
                <TabsContent value="timeseries" className="h-[400px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        
                        <Area
                          type="monotone"
                          dataKey="var99"
                          stroke={chartConfig.var99.color}
                          fill={chartConfig.var99.color}
                          fillOpacity={0.2}
                        />
                        <Area
                          type="monotone"
                          dataKey="var95"
                          stroke={chartConfig.var95.color}
                          fill={chartConfig.var95.color}
                          fillOpacity={0.3}
                        />
                        <Line
                          type="monotone"
                          dataKey="expectedShortfall"
                          stroke={chartConfig.expectedShortfall.color}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                        <Scatter
                          dataKey="actualPnL"
                          fill={chartConfig.actualPnL.color}
                        />
                        
                        <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                        <Brush dataKey="date" height={30} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </TabsContent>

                <TabsContent value="distribution" className="h-[400px]">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4">
                          <div className="text-2xl font-bold text-destructive">
                            ${Math.abs(currentVaR.var95).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">95% VaR</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-2xl font-bold text-destructive">
                            ${Math.abs(currentVaR.var99).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">99% VaR</div>
                        </Card>
                      </div>
                      <Card className="p-4">
                        <div className="text-2xl font-bold text-destructive">
                          ${Math.abs(currentVaR.expectedShortfall).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Expected Shortfall</div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="backtest" className="h-[400px]">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          {parseFloat(backtestResults.var95Accuracy) >= 94 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <div>
                            <div className="text-lg font-semibold">
                              {backtestResults.var95Accuracy}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              95% VaR Accuracy
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {backtestResults.violations95} violations out of {backtestResults.total} days
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          {parseFloat(backtestResults.var99Accuracy) >= 98 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <div>
                            <div className="text-lg font-semibold">
                              {backtestResults.var99Accuracy}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              99% VaR Accuracy
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {backtestResults.violations99} violations out of {backtestResults.total} days
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};