import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RealTimeCounter } from "@/components/shared/RealTimeCounter";
import { mockStrategies } from "@/data/mockData";
import { Strategy } from "@/types/trading";
import { 
  Settings, 
  TrendingUp, 
  Shield, 
  Target, 
  Activity,
  Play,
  Pause,
  BarChart3,
  Zap,
  Cog
} from "lucide-react";

function StrategyCard({ strategy }: { strategy: Strategy }) {
  const [isActive, setIsActive] = useState(strategy.isActive);
  const [allocation, setAllocation] = useState([strategy.allocation]);

  return (
    <Card className={`trading-card border-l-4 ${isActive ? 'border-l-profit' : 'border-l-muted'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{strategy.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{strategy.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {isActive ? (
              <Play className="h-4 w-4 text-profit" />
            ) : (
              <Pause className="h-4 w-4 text-muted-foreground" />
            )}
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Allocation</span>
            <span className="font-medium">{allocation[0]}%</span>
          </div>
          <Slider
            value={allocation}
            onValueChange={setAllocation}
            max={50}
            min={0}
            step={1}
            className="w-full"
            disabled={!isActive}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Return</p>
            <p className="font-medium profit-text">
              +<RealTimeCounter value={strategy.performance.totalReturn} decimals={1} suffix="%" />
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Sharpe</p>
            <p className="font-medium">
              <RealTimeCounter value={strategy.performance.sharpe} decimals={2} />
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Max DD</p>
            <p className="font-medium loss-text">
              <RealTimeCounter value={strategy.performance.maxDrawdown} decimals={1} suffix="%" />
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Win Rate</p>
            <p className="font-medium">
              <RealTimeCounter value={strategy.performance.winRate} decimals={0} suffix="%" />
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Last optimized: {strategy.lastOptimized.toLocaleDateString()}</p>
          <p>Trades: {strategy.performance.totalTrades}</p>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1">
                <Settings className="h-3 w-3 mr-1" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{strategy.name} Configuration</DialogTitle>
              </DialogHeader>
              <StrategyConfigurationDialog strategy={strategy} />
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="outline">
            <BarChart3 className="h-3 w-3 mr-1" />
            Backtest
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StrategyConfigurationDialog({ strategy }: { strategy: Strategy }) {
  const [parameters, setParameters] = useState(strategy.parameters);

  return (
    <Tabs defaultValue="parameters" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="parameters">Parameters</TabsTrigger>
        <TabsTrigger value="backtest">Backtest</TabsTrigger>
        <TabsTrigger value="optimization">Optimization</TabsTrigger>
      </TabsList>
      
      <TabsContent value="parameters" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(parameters).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label className="capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </Label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setParameters(prev => ({
                  ...prev,
                  [key]: parseFloat(e.target.value)
                }))}
                step={key.includes('Threshold') || key.includes('Loss') || key.includes('Profit') ? 0.01 : 1}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Reset to Default</Button>
          <Button>Save Parameters</Button>
        </div>
      </TabsContent>
      
      <TabsContent value="backtest" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" defaultValue="2023-01-01" />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="date" defaultValue="2024-01-25" />
          </div>
        </div>
        <div className="h-64 border rounded-lg flex items-center justify-center text-muted-foreground">
          Backtest Results Chart - Performance vs Benchmark
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Return</p>
            <p className="font-medium profit-text">+24.5%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sharpe Ratio</p>
            <p className="font-medium">1.92</p>
          </div>
          <div>
            <p className="text-muted-foreground">Max Drawdown</p>
            <p className="font-medium loss-text">-7.8%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Win Rate</p>
            <p className="font-medium">71%</p>
          </div>
        </div>
        <Button className="w-full">
          <Zap className="h-4 w-4 mr-2" />
          Run Backtest
        </Button>
      </TabsContent>
      
      <TabsContent value="optimization" className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Optimization Method</Label>
            <select className="w-full p-2 border rounded">
              <option>Grid Search</option>
              <option>Genetic Algorithm</option>
              <option>Bayesian Optimization</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Objective Function</Label>
            <select className="w-full p-2 border rounded">
              <option>Sharpe Ratio</option>
              <option>Total Return</option>
              <option>Calmar Ratio</option>
              <option>Information Ratio</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Training Period (months)</Label>
              <Input type="number" defaultValue="12" />
            </div>
            <div className="space-y-2">
              <Label>Walk-forward Steps</Label>
              <Input type="number" defaultValue="4" />
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-4 space-y-2">
          <h4 className="font-medium">Last Optimization Results</h4>
          <div className="text-sm text-muted-foreground">
            <p>Date: {strategy.lastOptimized.toLocaleDateString()}</p>
            <p>Improvement: +2.3% Sharpe Ratio</p>
            <p>Parameters updated: 3 of 4</p>
          </div>
        </div>
        <Button className="w-full">
          <Cog className="h-4 w-4 mr-2" />
          Schedule Optimization
        </Button>
      </TabsContent>
    </Tabs>
  );
}

function AllocationPieChart() {
  const activeStrategies = mockStrategies.filter(s => s.isActive);
  const totalAllocated = activeStrategies.reduce((sum, s) => sum + s.allocation, 0);
  const cashAllocation = 100 - totalAllocated;

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle>Strategy Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-48 flex items-center justify-center text-muted-foreground border rounded-lg">
            Interactive Pie Chart - Strategy Allocation Distribution
          </div>
          <div className="space-y-2">
            {activeStrategies.map((strategy, index) => (
              <div key={strategy.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                  />
                  <span className="text-sm">{strategy.name}</span>
                </div>
                <span className="text-sm font-medium">{strategy.allocation}%</span>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-muted" />
                <span className="text-sm">Cash</span>
              </div>
              <span className="text-sm font-medium">{cashAllocation}%</span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Rebalance Portfolio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Strategies() {
  const [strategies] = useState(mockStrategies);
  const activeStrategies = strategies.filter(s => s.isActive);
  const totalReturn = activeStrategies.reduce((sum, s) => sum + (s.performance.totalReturn * s.allocation / 100), 0);
  const avgSharpe = activeStrategies.reduce((sum, s) => sum + s.performance.sharpe, 0) / activeStrategies.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Strategy Manager</h1>
          <p className="text-muted-foreground">
            Configure and monitor your trading strategies
          </p>
        </div>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          Create New Strategy
        </Button>
      </div>

      {/* Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Strategies"
          value={activeStrategies.length}
          icon={Activity}
          trend="neutral"
        />
        <MetricCard
          title="Combined Return"
          value={`${totalReturn.toFixed(1)}%`}
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          title="Avg Sharpe Ratio"
          value={avgSharpe.toFixed(2)}
          icon={Target}
          trend="up"
        />
        <MetricCard
          title="Total Allocation"
          value={`${activeStrategies.reduce((sum, s) => sum + s.allocation, 0)}%`}
          icon={Shield}
          trend="neutral"
        />
      </div>

      {/* Strategy Cards and Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Strategy Configuration</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {strategies.map((strategy) => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Allocation</h2>
          <AllocationPieChart />
        </div>
      </div>

      {/* Strategy Performance Comparison */}
      <Card className="trading-card">
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Strategy</th>
                  <th className="text-right p-3">1M</th>
                  <th className="text-right p-3">3M</th>
                  <th className="text-right p-3">6M</th>
                  <th className="text-right p-3">YTD</th>
                  <th className="text-right p-3">1Y</th>
                  <th className="text-right p-3">Sharpe</th>
                  <th className="text-right p-3">Correlation</th>
                </tr>
              </thead>
              <tbody>
                {strategies.map(strategy => (
                  <tr key={strategy.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${strategy.isActive ? 'bg-profit' : 'bg-muted'}`} />
                        <span className="font-medium">{strategy.name}</span>
                      </div>
                    </td>
                    <td className="text-right p-3 profit-text">+3.2%</td>
                    <td className="text-right p-3 profit-text">+8.7%</td>
                    <td className="text-right p-3 profit-text">+15.4%</td>
                    <td className="text-right p-3 profit-text">
                      +{strategy.performance.totalReturn.toFixed(1)}%
                    </td>
                    <td className="text-right p-3 profit-text">
                      +{strategy.performance.annualizedReturn.toFixed(1)}%
                    </td>
                    <td className="text-right p-3">{strategy.performance.sharpe.toFixed(2)}</td>
                    <td className="text-right p-3">0.45</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Development */}
      <Card className="trading-card">
        <CardHeader>
          <CardTitle>Strategy Development</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-2 border-dashed border-muted cursor-pointer hover:border-primary transition-colors">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-muted rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-medium">Strategy Builder</h3>
                <p className="text-sm text-muted-foreground">Visual strategy creation tool</p>
              </div>
            </Card>
            <Card className="p-4 border-2 border-dashed border-muted cursor-pointer hover:border-primary transition-colors">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-muted rounded-lg flex items-center justify-center">
                  <Cog className="h-6 w-6" />
                </div>
                <h3 className="font-medium">Code Editor</h3>
                <p className="text-sm text-muted-foreground">Custom strategy development</p>
              </div>
            </Card>
            <Card className="p-4 border-2 border-dashed border-muted cursor-pointer hover:border-primary transition-colors">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-muted rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="font-medium">Template Library</h3>
                <p className="text-sm text-muted-foreground">Pre-built strategy templates</p>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}