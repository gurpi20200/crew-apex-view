import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Zap, 
  Target, 
  TrendingDown,
  Settings,
  Lock,
  Unlock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskParameters {
  maxPositionSize: number;
  stopLoss: number;
  maxDrawdown: number;
  leverage: number;
  varLimit: number;
  correlationLimit: number;
  concentrationLimit: number;
}

interface CircuitBreaker {
  id: string;
  name: string;
  threshold: number;
  enabled: boolean;
  triggered: boolean;
  description: string;
}

interface AdvancedRiskControlPanelProps {
  currentRisk: RiskParameters;
  onRiskChange: (params: RiskParameters) => void;
  portfolioValue: number;
  isLocked?: boolean;
}

export const AdvancedRiskControlPanel = ({
  currentRisk,
  onRiskChange,
  portfolioValue,
  isLocked = false
}: AdvancedRiskControlPanelProps) => {
  const [localRisk, setLocalRisk] = useState(currentRisk);
  const [isModified, setIsModified] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);
  
  const [circuitBreakers, setCircuitBreakers] = useState<CircuitBreaker[]>([
    {
      id: 'daily-loss',
      name: 'Daily Loss Limit',
      threshold: 5,
      enabled: true,
      triggered: false,
      description: 'Halt trading if daily loss exceeds threshold'
    },
    {
      id: 'var-breach',
      name: 'VaR Breach',
      threshold: 150,
      enabled: true,
      triggered: false,
      description: 'Emergency stop if VaR limit is exceeded'
    },
    {
      id: 'correlation-spike',
      name: 'Correlation Spike',
      threshold: 0.9,
      enabled: true,
      triggered: false,
      description: 'Alert when correlations exceed normal levels'
    },
    {
      id: 'liquidity-crisis',
      name: 'Liquidity Crisis',
      threshold: 0.3,
      enabled: true,
      triggered: false,
      description: 'Halt new positions during liquidity stress'
    }
  ]);

  useEffect(() => {
    const hasChanges = JSON.stringify(localRisk) !== JSON.stringify(currentRisk);
    setIsModified(hasChanges);
  }, [localRisk, currentRisk]);

  const handleParameterChange = (key: keyof RiskParameters, value: number[]) => {
    if (isLocked) return;
    
    setLocalRisk(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  const applyChanges = () => {
    onRiskChange(localRisk);
    setIsModified(false);
  };

  const resetChanges = () => {
    setLocalRisk(currentRisk);
    setIsModified(false);
  };

  const getImpactLevel = (currentValue: number, newValue: number, type: 'higher' | 'lower') => {
    const change = Math.abs(newValue - currentValue) / currentValue;
    if (change < 0.1) return 'low';
    if (change < 0.3) return 'medium';
    return 'high';
  };

  const toggleCircuitBreaker = (id: string) => {
    setCircuitBreakers(prev => 
      prev.map(cb => 
        cb.id === id ? { ...cb, enabled: !cb.enabled } : cb
      )
    );
  };

  const emergencyStop = () => {
    setEmergencyMode(true);
    // In real implementation, this would trigger emergency liquidation
    console.log('Emergency stop activated!');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Risk Control Panel
            {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={emergencyMode ? "destructive" : "secondary"}>
              {emergencyMode ? "Emergency Mode" : "Normal"}
            </Badge>
            <Button
              variant="destructive"
              size="sm"
              onClick={emergencyStop}
              disabled={emergencyMode}
            >
              <Shield className="h-4 w-4 mr-1" />
              Emergency Stop
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="parameters" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="parameters">Risk Parameters</TabsTrigger>
            <TabsTrigger value="breakers">Circuit Breakers</TabsTrigger>
            <TabsTrigger value="allocation">Dynamic Allocation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="parameters" className="space-y-6">
            {isModified && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>You have unsaved changes to risk parameters</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={resetChanges}>
                      Reset
                    </Button>
                    <Button size="sm" onClick={applyChanges}>
                      Apply Changes
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center justify-between">
                    Max Position Size (%)
                    <Badge variant="outline">
                      {localRisk.maxPositionSize}%
                    </Badge>
                  </Label>
                  <Slider
                    value={[localRisk.maxPositionSize]}
                    onValueChange={(value) => handleParameterChange('maxPositionSize', value)}
                    max={20}
                    min={1}
                    step={0.5}
                    className="mt-2"
                    disabled={isLocked}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Current exposure per position: ${(portfolioValue * localRisk.maxPositionSize / 100).toLocaleString()}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center justify-between">
                    Stop Loss (%)
                    <Badge variant="outline">
                      {localRisk.stopLoss}%
                    </Badge>
                  </Label>
                  <Slider
                    value={[localRisk.stopLoss]}
                    onValueChange={(value) => handleParameterChange('stopLoss', value)}
                    max={20}
                    min={1}
                    step={0.5}
                    className="mt-2"
                    disabled={isLocked}
                  />
                </div>

                <div>
                  <Label className="flex items-center justify-between">
                    Max Drawdown (%)
                    <Badge variant="outline">
                      {localRisk.maxDrawdown}%
                    </Badge>
                  </Label>
                  <Slider
                    value={[localRisk.maxDrawdown]}
                    onValueChange={(value) => handleParameterChange('maxDrawdown', value)}
                    max={25}
                    min={5}
                    step={1}
                    className="mt-2"
                    disabled={isLocked}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="flex items-center justify-between">
                    Leverage Ratio
                    <Badge variant="outline">
                      {localRisk.leverage}:1
                    </Badge>
                  </Label>
                  <Slider
                    value={[localRisk.leverage]}
                    onValueChange={(value) => handleParameterChange('leverage', value)}
                    max={5}
                    min={1}
                    step={0.1}
                    className="mt-2"
                    disabled={isLocked}
                  />
                </div>

                <div>
                  <Label className="flex items-center justify-between">
                    VaR Limit (% of portfolio)
                    <Badge variant="outline">
                      {localRisk.varLimit}%
                    </Badge>
                  </Label>
                  <Slider
                    value={[localRisk.varLimit]}
                    onValueChange={(value) => handleParameterChange('varLimit', value)}
                    max={10}
                    min={1}
                    step={0.5}
                    className="mt-2"
                    disabled={isLocked}
                  />
                </div>

                <div>
                  <Label className="flex items-center justify-between">
                    Concentration Limit (%)
                    <Badge variant="outline">
                      {localRisk.concentrationLimit}%
                    </Badge>
                  </Label>
                  <Slider
                    value={[localRisk.concentrationLimit]}
                    onValueChange={(value) => handleParameterChange('concentrationLimit', value)}
                    max={50}
                    min={10}
                    step={5}
                    className="mt-2"
                    disabled={isLocked}
                  />
                </div>
              </div>
            </div>

            {previewMode && isModified && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Impact Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Estimated Risk Impact</div>
                      <Progress value={35} className="mt-1" />
                      <div className="text-xs text-muted-foreground mt-1">
                        Moderate decrease in portfolio risk
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Profit Potential</div>
                      <Progress value={65} className="mt-1" />
                      <div className="text-xs text-muted-foreground mt-1">
                        Good balance of risk and return
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="breakers" className="space-y-4">
            {circuitBreakers.map((breaker) => (
              <Card key={breaker.id} className={cn(
                "transition-all",
                breaker.triggered && "border-destructive bg-destructive/5"
              )}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={breaker.enabled}
                        onCheckedChange={() => toggleCircuitBreaker(breaker.id)}
                      />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {breaker.name}
                          {breaker.triggered && (
                            <Badge variant="destructive" className="text-xs">
                              TRIGGERED
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {breaker.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg">
                        {breaker.threshold}
                        {breaker.id.includes('loss') || breaker.id.includes('var') ? '%' : ''}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Threshold
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="allocation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dynamic Risk Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">60%</div>
                      <div className="text-sm text-muted-foreground">Equities</div>
                      <Progress value={60} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">25%</div>
                      <div className="text-sm text-muted-foreground">Fixed Income</div>
                      <Progress value={25} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">15%</div>
                      <div className="text-sm text-muted-foreground">Alternatives</div>
                      <Progress value={15} className="mt-2" />
                    </div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Optimize Risk Budget Allocation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};