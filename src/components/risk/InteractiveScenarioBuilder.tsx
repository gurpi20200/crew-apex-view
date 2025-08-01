import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Save, 
  RotateCcw, 
  TrendingDown, 
  TrendingUp, 
  Zap,
  AlertTriangle,
  Target,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Area, ComposedChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ScenarioParameter {
  name: string;
  currentValue: number;
  shockValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  category: 'market' | 'economic' | 'credit' | 'liquidity';
}

interface ScenarioResult {
  timestamp: number;
  portfolioValue: number;
  var95: number;
  expectedShortfall: number;
  drawdown: number;
  volatility: number;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  parameters: ScenarioParameter[];
  results?: ScenarioResult[];
  severity: 'low' | 'medium' | 'high' | 'extreme';
}

const prebuiltScenarios: Scenario[] = [
  {
    id: 'market-crash',
    name: '2008-Style Market Crash',
    description: 'Severe equity decline with credit spreads widening',
    severity: 'extreme',
    parameters: [
      { name: 'Equity Markets', currentValue: 0, shockValue: -35, min: -50, max: 20, step: 1, unit: '%', category: 'market' },
      { name: 'Credit Spreads', currentValue: 100, shockValue: 400, min: 50, max: 800, step: 25, unit: 'bps', category: 'credit' },
      { name: 'Volatility (VIX)', currentValue: 20, shockValue: 60, min: 10, max: 80, step: 5, unit: '', category: 'market' },
      { name: 'USD Strength', currentValue: 0, shockValue: 15, min: -20, max: 30, step: 1, unit: '%', category: 'market' }
    ]
  },
  {
    id: 'rate-shock',
    name: 'Interest Rate Shock',
    description: 'Rapid rise in interest rates across the curve',
    severity: 'high',
    parameters: [
      { name: '10Y Treasury', currentValue: 4.5, shockValue: 7.0, min: 2, max: 10, step: 0.25, unit: '%', category: 'economic' },
      { name: '2Y Treasury', currentValue: 4.8, shockValue: 6.5, min: 2, max: 8, step: 0.25, unit: '%', category: 'economic' },
      { name: 'Real Rates', currentValue: 1.5, shockValue: 3.5, min: -1, max: 5, step: 0.25, unit: '%', category: 'economic' },
      { name: 'Bond Volatility', currentValue: 5, shockValue: 12, min: 3, max: 20, step: 1, unit: '%', category: 'market' }
    ]
  },
  {
    id: 'liquidity-crisis',
    name: 'Liquidity Crisis',
    description: 'Market liquidity dries up across asset classes',
    severity: 'high',
    parameters: [
      { name: 'Bid-Ask Spreads', currentValue: 0.1, shockValue: 0.8, min: 0.05, max: 2, step: 0.05, unit: '%', category: 'liquidity' },
      { name: 'Market Depth', currentValue: 100, shockValue: 25, min: 10, max: 100, step: 5, unit: '%', category: 'liquidity' },
      { name: 'Funding Costs', currentValue: 200, shockValue: 800, min: 100, max: 1500, step: 50, unit: 'bps', category: 'credit' },
      { name: 'Asset Correlations', currentValue: 0.3, shockValue: 0.9, min: 0.1, max: 1, step: 0.1, unit: '', category: 'market' }
    ]
  }
];

const chartConfig = {
  portfolioValue: { label: "Portfolio Value", color: "hsl(var(--chart-1))" },
  var95: { label: "95% VaR", color: "hsl(var(--chart-2))" },
  expectedShortfall: { label: "Expected Shortfall", color: "hsl(var(--chart-3))" },
  drawdown: { label: "Drawdown", color: "hsl(var(--chart-4))" }
};

export const InteractiveScenarioBuilder = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [customParameters, setCustomParameters] = useState<ScenarioParameter[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([]);

  const currentParameters = selectedScenario?.parameters || customParameters;

  const updateParameter = (index: number, field: 'shockValue', value: number) => {
    if (selectedScenario) {
      setSelectedScenario({
        ...selectedScenario,
        parameters: selectedScenario.parameters.map((param, i) => 
          i === index ? { ...param, [field]: value } : param
        )
      });
    } else {
      setCustomParameters(prev => 
        prev.map((param, i) => 
          i === index ? { ...param, [field]: value } : param
        )
      );
    }
  };

  const runScenario = async () => {
    setIsRunning(true);
    
    // Simulate scenario execution
    const simulatedResults: ScenarioResult[] = [];
    const baseValue = 1000000;
    
    for (let i = 0; i <= 30; i++) {
      const progress = i / 30;
      const equityShock = currentParameters.find(p => p.name.includes('Equity'))?.shockValue || 0;
      const volatilityShock = currentParameters.find(p => p.name.includes('Volatility') || p.name.includes('VIX'))?.shockValue || 20;
      
      // Simulate portfolio impact over time
      const impact = progress * (equityShock / 100);
      const portfolioValue = baseValue * (1 + impact);
      const var95 = Math.abs(portfolioValue * 0.05 * (volatilityShock / 20));
      const expectedShortfall = var95 * 1.3;
      const drawdown = Math.min(0, impact * 100);
      const volatility = (volatilityShock / 100) * (1 + progress * 0.5);
      
      simulatedResults.push({
        timestamp: i,
        portfolioValue,
        var95,
        expectedShortfall,
        drawdown,
        volatility
      });
      
      // Add delay to simulate real calculation
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setResults(simulatedResults);
    setIsRunning(false);
  };

  const saveScenario = () => {
    if (!selectedScenario) return;
    
    const scenarioToSave = {
      ...selectedScenario,
      id: `custom-${Date.now()}`,
      results
    };
    
    setSavedScenarios(prev => [...prev, scenarioToSave]);
  };

  const resetScenario = () => {
    if (selectedScenario) {
      const original = prebuiltScenarios.find(s => s.id === selectedScenario.id);
      if (original) {
        setSelectedScenario({ ...original });
      }
    }
    setResults([]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'extreme': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const impactSummary = useMemo(() => {
    if (results.length === 0) return null;
    
    const finalResult = results[results.length - 1];
    const initialValue = results[0].portfolioValue;
    const totalReturn = ((finalResult.portfolioValue - initialValue) / initialValue) * 100;
    const maxDrawdown = Math.min(...results.map(r => r.drawdown));
    const maxVar = Math.max(...results.map(r => r.var95));
    
    return {
      totalReturn,
      maxDrawdown,
      maxVar,
      finalVolatility: finalResult.volatility
    };
  }, [results]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Interactive Scenario Builder
              <Badge variant="secondary" className="text-xs">Monte Carlo</Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={runScenario} 
                disabled={isRunning || currentParameters.length === 0}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <Activity className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isRunning ? 'Running...' : 'Run Scenario'}
              </Button>
              <Button variant="outline" onClick={saveScenario} disabled={!results.length}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" onClick={resetScenario}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="builder">Scenario Builder</TabsTrigger>
              <TabsTrigger value="results">Results & Analysis</TabsTrigger>
              <TabsTrigger value="library">Scenario Library</TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                  <h3 className="font-semibold mb-3">Pre-built Scenarios</h3>
                  <div className="space-y-2">
                    {prebuiltScenarios.map((scenario) => (
                      <Card 
                        key={scenario.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedScenario?.id === scenario.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedScenario({ ...scenario })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{scenario.name}</h4>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getSeverityColor(scenario.severity)} text-white`}
                            >
                              {scenario.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {scenario.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  {selectedScenario && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{selectedScenario.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-6">
                            {selectedScenario.parameters.map((param, index) => (
                              <div key={param.name} className="space-y-2">
                                <Label className="flex items-center justify-between">
                                  <span>{param.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {param.category}
                                  </Badge>
                                </Label>
                                <div className="flex items-center gap-4">
                                  <div className="flex-1">
                                    <Slider
                                      value={[param.shockValue]}
                                      onValueChange={(value) => updateParameter(index, 'shockValue', value[0])}
                                      min={param.min}
                                      max={param.max}
                                      step={param.step}
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 min-w-[120px]">
                                    <Input
                                      type="number"
                                      value={param.shockValue}
                                      onChange={(e) => updateParameter(index, 'shockValue', parseFloat(e.target.value))}
                                      className="w-16 h-8 text-xs"
                                      step={param.step}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                      {param.unit}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Current: {param.currentValue}{param.unit}</span>
                                  <span>
                                    Impact: {param.shockValue > param.currentValue ? '+' : ''}
                                    {(param.shockValue - param.currentValue).toFixed(2)}{param.unit}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-4">
              {results.length > 0 ? (
                <>
                  {impactSummary && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          {impactSummary.totalReturn >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <div>
                            <div className="text-lg font-semibold">
                              {impactSummary.totalReturn.toFixed(2)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Total Return</div>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <div>
                            <div className="text-lg font-semibold">
                              {impactSummary.maxDrawdown.toFixed(2)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Max Drawdown</div>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <div>
                            <div className="text-lg font-semibold">
                              ${impactSummary.maxVar.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Peak VaR</div>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="text-lg font-semibold">
                              {(impactSummary.finalVolatility * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Final Volatility</div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Scenario Evolution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ChartContainer config={chartConfig}>
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={results}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="timestamp" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              
                              <Area
                                type="monotone"
                                dataKey="portfolioValue"
                                stroke={chartConfig.portfolioValue.color}
                                fill={chartConfig.portfolioValue.color}
                                fillOpacity={0.3}
                              />
                              <Line
                                type="monotone"
                                dataKey="var95"
                                stroke={chartConfig.var95.color}
                                strokeWidth={2}
                              />
                              <Line
                                type="monotone"
                                dataKey="expectedShortfall"
                                stroke={chartConfig.expectedShortfall.color}
                                strokeWidth={2}
                                strokeDasharray="5 5"
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-[300px]">
                    <div className="text-center">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Run a scenario to see the results and analysis
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="library" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedScenarios.map((scenario) => (
                  <Card key={scenario.id} className="cursor-pointer hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{scenario.name}</h4>
                        <Badge variant="secondary">{scenario.severity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {scenario.description}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedScenario(scenario)}
                        >
                          Load
                        </Button>
                        <Button size="sm" variant="outline">
                          View Results
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {savedScenarios.length === 0 && (
                  <Card className="col-span-full">
                    <CardContent className="flex items-center justify-center h-[200px]">
                      <div className="text-center">
                        <Save className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          No saved scenarios yet. Create and save scenarios to build your library.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};