import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RealTimeCounter } from "@/components/shared/RealTimeCounter";
import { Risk3DSurface } from "@/components/risk/Risk3DSurface";
import { InteractiveVaRDashboard } from "@/components/risk/InteractiveVaRDashboard";
import { AdvancedRiskHeatMaps } from "@/components/risk/AdvancedRiskHeatMaps";
import { AdvancedRiskControlPanel } from "@/components/risk/AdvancedRiskControlPanel";
import { InteractiveScenarioBuilder } from "@/components/risk/InteractiveScenarioBuilder";
import { useAdvancedRiskMetrics } from "@/hooks/useAdvancedRiskMetrics";
import { mockRiskMetrics } from "@/data/mockData";
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown, 
  Activity, 
  Target,
  Settings,
  AlertCircle,
  Zap,
  Brain,
  BarChart3,
  Layers,
  Eye
} from "lucide-react";

interface RiskParameters {
  maxPositionSize: number;
  stopLoss: number;
  maxDrawdown: number;
  leverage: number;
  varLimit: number;
  correlationLimit: number;
  concentrationLimit: number;
}

export default function RiskManagement() {
  const riskMetrics = mockRiskMetrics;
  const { metrics: advancedMetrics, isCalculating } = useAdvancedRiskMetrics({
    confidenceLevel: 0.95,
    timeHorizon: 1,
    updateInterval: 30000
  });

  const [currentRiskParams, setCurrentRiskParams] = useState<RiskParameters>({
    maxPositionSize: 15,
    stopLoss: 8,
    maxDrawdown: 12,
    leverage: 1.5,
    varLimit: 5,
    correlationLimit: 0.7,
    concentrationLimit: 25
  });

  // Mock data for 3D visualization
  const correlationData = [
    { symbol1: 'AAPL', symbol2: 'MSFT', correlation: 0.65 },
    { symbol1: 'AAPL', symbol2: 'GOOGL', correlation: 0.72 },
    { symbol1: 'AAPL', symbol2: 'TSLA', correlation: 0.58 },
    { symbol1: 'AAPL', symbol2: 'NVDA', correlation: 0.81 },
    { symbol1: 'MSFT', symbol2: 'GOOGL', correlation: 0.43 },
    { symbol1: 'MSFT', symbol2: 'TSLA', correlation: 0.69 },
    { symbol1: 'MSFT', symbol2: 'NVDA', correlation: 0.52 },
    { symbol1: 'GOOGL', symbol2: 'TSLA', correlation: 0.61 },
    { symbol1: 'GOOGL', symbol2: 'NVDA', correlation: 0.74 },
    { symbol1: 'TSLA', symbol2: 'NVDA', correlation: 0.45 }
  ];

  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA'];

  // Mock VaR data
  const varData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    portfolioValue: 1000000 + Math.random() * 50000 - 25000,
    var95: -2000 - Math.random() * 1000,
    var99: -3500 - Math.random() * 1500,
    expectedShortfall: -4200 - Math.random() * 800,
    actualPnL: (Math.random() - 0.5) * 5000,
    confidence: 95
  }));

  const currentVaR = {
    var95: riskMetrics.portfolioVaR.oneDay,
    var99: riskMetrics.portfolioVaR.fiveDay,
    expectedShortfall: riskMetrics.expectedShortfall,
    confidence: riskMetrics.portfolioVaR.confidence
  };

  // Mock heat map data
  const sectorData = [
    { row: 'Technology', col: 'Q1', value: 0.35, percentage: 35 },
    { row: 'Technology', col: 'Q2', value: 0.28, percentage: 28 },
    { row: 'Technology', col: 'Q3', value: 0.42, percentage: 42 },
    { row: 'Technology', col: 'Q4', value: 0.31, percentage: 31 },
    { row: 'Healthcare', col: 'Q1', value: 0.15, percentage: 15 },
    { row: 'Healthcare', col: 'Q2', value: 0.18, percentage: 18 },
    { row: 'Healthcare', col: 'Q3', value: 0.12, percentage: 12 },
    { row: 'Healthcare', col: 'Q4', value: 0.22, percentage: 22 },
    { row: 'Finance', col: 'Q1', value: 0.25, percentage: 25 },
    { row: 'Finance', col: 'Q2', value: 0.19, percentage: 19 },
    { row: 'Finance', col: 'Q3', value: 0.28, percentage: 28 },
    { row: 'Finance', col: 'Q4', value: 0.24, percentage: 24 }
  ];

  const geographicData = [
    { row: 'North America', col: 'Equities', value: 0.45, percentage: 45 },
    { row: 'North America', col: 'Bonds', value: 0.25, percentage: 25 },
    { row: 'North America', col: 'Commodities', value: 0.08, percentage: 8 },
    { row: 'Europe', col: 'Equities', value: 0.22, percentage: 22 },
    { row: 'Europe', col: 'Bonds', value: 0.15, percentage: 15 },
    { row: 'Europe', col: 'Commodities', value: 0.05, percentage: 5 },
    { row: 'Asia Pacific', col: 'Equities', value: 0.18, percentage: 18 },
    { row: 'Asia Pacific', col: 'Bonds', value: 0.12, percentage: 12 },
    { row: 'Asia Pacific', col: 'Commodities', value: 0.03, percentage: 3 }
  ];

  const concentrationData = [
    { row: 'Top 5 Holdings', col: 'Risk Contribution', value: 0.65, percentage: 65 },
    { row: 'Top 10 Holdings', col: 'Risk Contribution', value: 0.82, percentage: 82 },
    { row: 'Sector Concentration', col: 'Risk Contribution', value: 0.48, percentage: 48 },
    { row: 'Strategy Concentration', col: 'Risk Contribution', value: 0.35, percentage: 35 }
  ];

  const timeData = [
    { row: 'Morning', col: 'Mon', value: 0.15, percentage: 15 },
    { row: 'Morning', col: 'Tue', value: 0.12, percentage: 12 },
    { row: 'Morning', col: 'Wed', value: 0.18, percentage: 18 },
    { row: 'Morning', col: 'Thu', value: 0.14, percentage: 14 },
    { row: 'Morning', col: 'Fri', value: 0.22, percentage: 22 },
    { row: 'Afternoon', col: 'Mon', value: 0.08, percentage: 8 },
    { row: 'Afternoon', col: 'Tue', value: 0.11, percentage: 11 },
    { row: 'Afternoon', col: 'Wed', value: 0.09, percentage: 9 },
    { row: 'Afternoon', col: 'Thu', value: 0.13, percentage: 13 },
    { row: 'Afternoon', col: 'Fri', value: 0.16, percentage: 16 }
  ];

  const handleRiskParameterChange = (newParams: RiskParameters) => {
    setCurrentRiskParams(newParams);
    // In real implementation, this would update the risk engine
    console.log('Risk parameters updated:', newParams);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Professional Risk Management</h1>
          <p className="text-muted-foreground">
            Advanced risk analytics with 3D visualizations and interactive controls
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isCalculating ? "secondary" : "default"} className="flex items-center gap-1">
            {isCalculating ? (
              <Activity className="h-3 w-3 animate-spin" />
            ) : (
              <Brain className="h-3 w-3" />
            )}
            {isCalculating ? 'Calculating...' : 'AI Active'}
          </Badge>
          <Button variant="destructive" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Emergency Stop
          </Button>
        </div>
      </div>

      {/* Enhanced Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="1-Day VaR (95%)"
          value={riskMetrics.portfolioVaR.oneDay}
          icon={Shield}
          trend="down"
          className="border-l-4 border-l-loss"
          isRealTime={true}
          formatType="currency"
        />
        <MetricCard
          title="Expected Shortfall"
          value={riskMetrics.expectedShortfall}
          icon={TrendingDown}
          trend="down"
          className="border-l-4 border-l-warning"
          isRealTime={true}
          formatType="currency"
        />
        <MetricCard
          title="Current Drawdown"
          value={`${(riskMetrics.currentDrawdown * 100).toFixed(1)}%`}
          icon={AlertTriangle}
          trend="down"
          className="border-l-4 border-l-loss"
          isRealTime={true}
          formatType="percentage"
        />
        <MetricCard
          title="Portfolio Beta"
          value={riskMetrics.betaToMarket.toFixed(2)}
          icon={Activity}
          trend="neutral"
          className="border-l-4 border-l-neutral"
          isRealTime={true}
          formatType="number"
        />
        <MetricCard
          title="Sharpe Ratio"
          value={riskMetrics.sharpeRatio.toFixed(2)}
          icon={Target}
          trend="up"
          className="border-l-4 border-l-profit"
          isRealTime={true}
          formatType="number"
        />
      </div>

      {/* Professional Risk Management Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="var-analysis" className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            VaR Analysis
          </TabsTrigger>
          <TabsTrigger value="correlation" className="flex items-center gap-1">
            <Layers className="h-3 w-3" />
            3D Correlation
          </TabsTrigger>
          <TabsTrigger value="heatmaps" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Heat Maps
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            Scenarios
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center gap-1">
            <Settings className="h-3 w-3" />
            Controls
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Risk Metrics */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Live Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Portfolio Volatility</p>
                    <p className="text-xl font-bold">
                      <RealTimeCounter 
                        value={riskMetrics.volatility * 100} 
                        decimals={1} 
                        suffix="%" 
                        trend="neutral"
                        highlightChange={true}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Leverage Ratio</p>
                    <p className="text-xl font-bold">
                      <RealTimeCounter 
                        value={riskMetrics.leverageRatio} 
                        decimals={2} 
                        suffix="x"
                        trend="neutral"
                        highlightChange={true}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Concentration Risk</p>
                    <p className="text-xl font-bold">
                      <RealTimeCounter 
                        value={riskMetrics.concentrationRisk * 100} 
                        decimals={1} 
                        suffix="%"
                        trend="down"
                        highlightChange={true}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Max Drawdown</p>
                    <p className="text-xl font-bold loss-text">
                      <RealTimeCounter 
                        value={riskMetrics.maxDrawdown * 100} 
                        decimals={1} 
                        suffix="%"
                        trend="down"
                        highlightChange={true}
                      />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Alerts Summary */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Active Risk Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">High Sector Concentration</p>
                    <p className="text-xs text-muted-foreground">
                      Technology sector exposure: 42% (Threshold: 35%)
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-warning/10 text-warning">
                    Medium
                  </Badge>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-loss/10 border border-loss/20">
                  <AlertCircle className="h-4 w-4 text-loss mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">VaR Limit Approaching</p>
                    <p className="text-xs text-muted-foreground">
                      Current VaR: $2,850 (Limit: $3,000)
                    </p>
                  </div>
                  <Badge variant="destructive">
                    High
                  </Badge>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
                  <Shield className="h-4 w-4 text-profit mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Risk Controls Active</p>
                    <p className="text-xs text-muted-foreground">
                      All circuit breakers operational
                    </p>
                  </div>
                  <Badge variant="default" className="bg-profit/10 text-profit">
                    Normal
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Risk Summary */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle>Risk Summary Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-lg">
                Real-time Risk Dashboard - Portfolio risk evolution over time with key metrics overlay
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="var-analysis" className="space-y-6">
          <InteractiveVaRDashboard 
            varData={varData}
            currentVaR={currentVaR}
          />
        </TabsContent>

        <TabsContent value="correlation" className="space-y-6">
          <Risk3DSurface 
            correlationData={correlationData}
            symbols={symbols}
          />
          
          <Card className="trading-card">
            <CardHeader>
              <CardTitle>Correlation Analysis Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">0.72</p>
                  <p className="text-sm text-muted-foreground">Highest Correlation</p>
                  <p className="text-xs">AAPL - GOOGL</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-profit">0.43</p>
                  <p className="text-sm text-muted-foreground">Lowest Correlation</p>
                  <p className="text-xs">MSFT - GOOGL</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">0.61</p>
                  <p className="text-sm text-muted-foreground">Average Correlation</p>
                  <p className="text-xs">Portfolio Diversification</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmaps" className="space-y-6">
          <AdvancedRiskHeatMaps
            sectorData={sectorData}
            geographicData={geographicData}
            concentrationData={concentrationData}
            timeData={timeData}
          />
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <InteractiveScenarioBuilder />
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <AdvancedRiskControlPanel
            currentRisk={currentRiskParams}
            onRiskChange={handleRiskParameterChange}
            portfolioValue={125000}
            isLocked={false}
          />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Risk Alert Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 border-l-4 border-l-loss">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-loss" />
                      <span className="font-medium">Critical Alerts</span>
                    </div>
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-xs text-muted-foreground">Require immediate attention</p>
                  </Card>
                  
                  <Card className="p-4 border-l-4 border-l-warning">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <span className="font-medium">Warning Alerts</span>
                    </div>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-xs text-muted-foreground">Monitor closely</p>
                  </Card>
                  
                  <Card className="p-4 border-l-4 border-l-profit">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-profit" />
                      <span className="font-medium">System Health</span>
                    </div>
                    <p className="text-2xl font-bold text-profit">98%</p>
                    <p className="text-xs text-muted-foreground">All systems operational</p>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Recent Risk Events</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-loss rounded-full" />
                        <div>
                          <p className="text-sm font-medium">VaR Breach Alert</p>
                          <p className="text-xs text-muted-foreground">Portfolio VaR exceeded daily limit</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">2 min ago</p>
                        <Badge variant="destructive" className="text-xs">Active</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-warning rounded-full" />
                        <div>
                          <p className="text-sm font-medium">Correlation Spike</p>
                          <p className="text-xs text-muted-foreground">AAPL-TSLA correlation increased to 0.85</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">15 min ago</p>
                        <Badge variant="secondary" className="text-xs">Monitoring</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-profit rounded-full" />
                        <div>
                          <p className="text-sm font-medium">Risk Limit Restored</p>
                          <p className="text-xs text-muted-foreground">Portfolio drawdown back within limits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                        <Badge variant="default" className="bg-profit/10 text-profit text-xs">Resolved</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}