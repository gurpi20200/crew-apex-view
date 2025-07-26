import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RealTimeCounter } from "@/components/shared/RealTimeCounter";
import { mockRiskMetrics } from "@/data/mockData";
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown, 
  Activity, 
  Target,
  Settings,
  AlertCircle,
  Zap
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function CorrelationHeatmap() {
  const symbols = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'NVDA'];
  const matrix = mockRiskMetrics.correlationMatrix;

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Position Correlation Matrix</h3>
      <div className="grid grid-cols-6 gap-1 text-xs">
        <div></div>
        {symbols.map(symbol => (
          <div key={symbol} className="text-center font-medium">{symbol}</div>
        ))}
        {symbols.map((symbol, i) => (
          <div key={symbol} className="contents">
            <div className="font-medium">{symbol}</div>
            {matrix[i].map((corr, j) => (
              <div
                key={j}
                className="aspect-square flex items-center justify-center rounded text-xs font-medium"
                style={{
                  backgroundColor: `hsl(${corr > 0 ? '0' : '120'}, ${Math.abs(corr) * 50}%, ${50 + Math.abs(corr) * 20}%)`
                }}
              >
                {corr.toFixed(2)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskControlPanel() {
  const [maxPositionSize, setMaxPositionSize] = useState([15]);
  const [globalStopLoss, setGlobalStopLoss] = useState([8]);
  const [maxDrawdown, setMaxDrawdown] = useState([12]);
  const [leverageLimit, setLeverageLimit] = useState([1.5]);
  const [circuitBreakers, setCircuitBreakers] = useState({
    volatilitySpike: true,
    correlationBreak: true,
    drawdownLimit: true,
    liquidityDrop: false
  });

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Risk Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Max Position Size</span>
              <span className="text-sm">{maxPositionSize[0]}%</span>
            </div>
            <Slider
              value={maxPositionSize}
              onValueChange={setMaxPositionSize}
              max={30}
              min={5}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Global Stop Loss</span>
              <span className="text-sm">{globalStopLoss[0]}%</span>
            </div>
            <Slider
              value={globalStopLoss}
              onValueChange={setGlobalStopLoss}
              max={20}
              min={2}
              step={0.5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Max Drawdown</span>
              <span className="text-sm">{maxDrawdown[0]}%</span>
            </div>
            <Slider
              value={maxDrawdown}
              onValueChange={setMaxDrawdown}
              max={25}
              min={5}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Leverage Limit</span>
              <span className="text-sm">{leverageLimit[0]}x</span>
            </div>
            <Slider
              value={leverageLimit}
              onValueChange={setLeverageLimit}
              max={3}
              min={1}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Circuit Breakers</h4>
          {Object.entries(circuitBreakers).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) =>
                  setCircuitBreakers(prev => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              EMERGENCY LIQUIDATE ALL
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Emergency Liquidation</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately close all open positions at market prices. 
                This action cannot be undone and may result in significant losses.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground">
                Liquidate All Positions
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

function RiskAlerts() {
  const alerts = [
    {
      id: '1',
      level: 'warning' as const,
      message: 'Portfolio concentration in tech sector exceeds 35%',
      time: '2 minutes ago'
    },
    {
      id: '2',
      level: 'info' as const,
      message: 'VaR calculation completed for next trading session',
      time: '15 minutes ago'
    },
    {
      id: '3',
      level: 'warning' as const,
      message: 'Correlation spike detected between AAPL and MSFT',
      time: '1 hour ago'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'loss';
      case 'warning': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Risk Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map(alert => (
          <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className={`w-2 h-2 rounded-full mt-2 bg-${getLevelColor(alert.level)}`} />
            <div className="flex-1">
              <p className="text-sm">{alert.message}</p>
              <p className="text-xs text-muted-foreground">{alert.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function RiskManagement() {
  const riskMetrics = mockRiskMetrics;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Risk Management</h1>
          <p className="text-muted-foreground">
            Monitor and control portfolio risk exposure
          </p>
        </div>
        <Button variant="destructive" size="sm">
          Emergency Stop
        </Button>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="1-Day VaR (95%)"
          value={riskMetrics.portfolioVaR.oneDay}
          icon={Shield}
          trend="down"
          className="border-l-4 border-l-loss"
        />
        <MetricCard
          title="Expected Shortfall"
          value={riskMetrics.expectedShortfall}
          icon={TrendingDown}
          trend="down"
          className="border-l-4 border-l-warning"
        />
        <MetricCard
          title="Current Drawdown"
          value={`${(riskMetrics.currentDrawdown * 100).toFixed(1)}%`}
          icon={AlertTriangle}
          trend="down"
          className="border-l-4 border-l-loss"
        />
        <MetricCard
          title="Portfolio Beta"
          value={riskMetrics.betaToMarket.toFixed(2)}
          icon={Activity}
          trend="neutral"
          className="border-l-4 border-l-neutral"
        />
      </div>

      {/* Risk Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="trading-card">
          <CardHeader>
            <CardTitle>VaR Trending (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              VaR Chart Placeholder - Would show Value at Risk over time
            </div>
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader>
            <CardTitle>Drawdown Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Current Drawdown</span>
                <span className="loss-text font-medium">
                  {(riskMetrics.currentDrawdown * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={Math.abs(riskMetrics.currentDrawdown) * 100} 
                className="h-3"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Max Historical: {(riskMetrics.maxDrawdown * 100).toFixed(1)}%</span>
                <span>Recovery Days: 12</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Correlation and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="trading-card">
          <CardHeader>
            <CardTitle>Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CorrelationHeatmap />
            
            <div className="space-y-4">
              <h3 className="font-medium">Concentration Risk</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Top 5 Positions</span>
                  <span>{(riskMetrics.concentrationRisk * 100).toFixed(1)}%</span>
                </div>
                <Progress value={riskMetrics.concentrationRisk * 100} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Leverage Ratio</p>
                  <p className="font-medium">
                    <RealTimeCounter value={riskMetrics.leverageRatio} decimals={2} suffix="x" />
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sharpe Ratio</p>
                  <p className="font-medium">
                    <RealTimeCounter value={riskMetrics.sharpeRatio} decimals={2} />
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <RiskControlPanel />
      </div>

      {/* Stress Testing and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="trading-card">
          <CardHeader>
            <CardTitle>Stress Testing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Historical Scenarios</h4>
              {[
                { name: '2008 Financial Crisis', impact: -15.2 },
                { name: 'COVID-19 Crash', impact: -12.8 },
                { name: 'Flash Crash 2010', impact: -8.4 },
                { name: 'Brexit Vote', impact: -5.2 }
              ].map(scenario => (
                <div key={scenario.name} className="flex justify-between items-center">
                  <span className="text-sm">{scenario.name}</span>
                  <Badge variant="destructive" className="text-xs">
                    {scenario.impact}%
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              Run Monte Carlo Simulation
            </Button>
          </CardContent>
        </Card>

        <RiskAlerts />
      </div>
    </div>
  );
}