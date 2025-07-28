import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TradingSignal } from "@/types/trading";
import { 
  Play, 
  Square, 
  Filter,
  CheckCircle2,
  AlertCircle,
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface BatchSignalOperationsProps {
  signals: TradingSignal[];
  onExecuteBatch: (signals: TradingSignal[], action: 'execute' | 'dismiss') => void;
  onFilterChange: (filters: BatchFilters) => void;
}

interface BatchFilters {
  minConfidence: number;
  minStrength: number;
  strategies: string[];
  signalTypes: string[];
  maxRisk: number;
}

export function BatchSignalOperations({ 
  signals, 
  onExecuteBatch, 
  onFilterChange 
}: BatchSignalOperationsProps) {
  const [selectedSignals, setSelectedSignals] = useState<Set<string>>(new Set());
  const [batchFilters, setBatchFilters] = useState<BatchFilters>({
    minConfidence: 70,
    minStrength: 6,
    strategies: [],
    signalTypes: [],
    maxRisk: 1000
  });

  const handleSelectAll = () => {
    if (selectedSignals.size === signals.length) {
      setSelectedSignals(new Set());
    } else {
      setSelectedSignals(new Set(signals.map(s => s.id)));
    }
  };

  const handleSelectSignal = (signalId: string) => {
    const newSelected = new Set(selectedSignals);
    if (newSelected.has(signalId)) {
      newSelected.delete(signalId);
    } else {
      newSelected.add(signalId);
    }
    setSelectedSignals(newSelected);
  };

  const handleSmartFilter = () => {
    // Auto-select high-confidence, high-strength signals
    const highQualitySignals = signals.filter(signal => 
      signal.confidence >= batchFilters.minConfidence && 
      signal.strength >= batchFilters.minStrength
    );
    setSelectedSignals(new Set(highQualitySignals.map(s => s.id)));
  };

  const selectedSignalObjects = signals.filter(s => selectedSignals.has(s.id));
  const totalPotentialReturn = selectedSignalObjects.reduce((acc, signal) => {
    const potentialGain = Math.abs(signal.targetPrice - signal.currentPrice) * 100; // Assuming 100 shares
    return acc + potentialGain;
  }, 0);

  const totalRisk = selectedSignalObjects.reduce((acc, signal) => {
    const potentialLoss = Math.abs(signal.currentPrice - signal.stopLoss) * 100; // Assuming 100 shares
    return acc + potentialLoss;
  }, 0);

  const avgConfidence = selectedSignalObjects.length > 0 
    ? selectedSignalObjects.reduce((acc, s) => acc + s.confidence, 0) / selectedSignalObjects.length 
    : 0;

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Batch Operations
          </div>
          <Badge variant="secondary">
            {selectedSignals.size} of {signals.length} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Batch Selection Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedSignals.size === signals.length && signals.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Select All
                </label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSmartFilter}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Smart Filter
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Select
              value={batchFilters.minConfidence.toString()}
              onValueChange={(value) => {
                const newFilters = { ...batchFilters, minConfidence: parseInt(value) };
                setBatchFilters(newFilters);
                onFilterChange(newFilters);
              }}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Min Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60% Confidence</SelectItem>
                <SelectItem value="70">70% Confidence</SelectItem>
                <SelectItem value="80">80% Confidence</SelectItem>
                <SelectItem value="90">90% Confidence</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={batchFilters.minStrength.toString()}
              onValueChange={(value) => {
                const newFilters = { ...batchFilters, minStrength: parseInt(value) };
                setBatchFilters(newFilters);
                onFilterChange(newFilters);
              }}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Min Strength" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Strength 5+</SelectItem>
                <SelectItem value="6">Strength 6+</SelectItem>
                <SelectItem value="7">Strength 7+</SelectItem>
                <SelectItem value="8">Strength 8+</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedSignals(new Set(signals.filter(s => s.signalType === 'BUY').map(s => s.id)))}
              className="h-8"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              BUY Only
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedSignals(new Set(signals.filter(s => s.signalType === 'SELL').map(s => s.id)))}
              className="h-8"
            >
              <TrendingDown className="h-3 w-3 mr-1" />
              SELL Only
            </Button>
          </div>
        </div>

        <Separator />

        {/* Batch Summary */}
        {selectedSignals.size > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Batch Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="text-lg font-bold">{selectedSignals.size}</p>
                <p className="text-muted-foreground">Signals</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-profit">{avgConfidence.toFixed(1)}%</p>
                <p className="text-muted-foreground">Avg Confidence</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-profit">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  {totalPotentialReturn.toFixed(0)}
                </p>
                <p className="text-muted-foreground">Potential Return</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-loss">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  {totalRisk.toFixed(0)}
                </p>
                <p className="text-muted-foreground">Total Risk</p>
              </div>
            </div>

            {/* Signal Type Breakdown */}
            <div className="flex gap-2">
              {['BUY', 'SELL', 'HOLD'].map(type => {
                const count = selectedSignalObjects.filter(s => s.signalType === type).length;
                if (count === 0) return null;
                return (
                  <Badge key={type} variant="outline" className="flex items-center gap-1">
                    {type === 'BUY' && <TrendingUp className="h-3 w-3 text-profit" />}
                    {type === 'SELL' && <TrendingDown className="h-3 w-3 text-loss" />}
                    {type === 'HOLD' && <Target className="h-3 w-3 text-muted-foreground" />}
                    {count} {type}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <Separator />

        {/* Batch Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => onExecuteBatch(selectedSignalObjects, 'execute')}
            disabled={selectedSignals.size === 0}
            className="flex-1"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            Execute Selected ({selectedSignals.size})
          </Button>
          <Button
            variant="outline"
            onClick={() => onExecuteBatch(selectedSignalObjects, 'dismiss')}
            disabled={selectedSignals.size === 0}
            size="sm"
          >
            <Square className="h-4 w-4 mr-2" />
            Dismiss
          </Button>
        </div>

        {/* Individual Signal Selection */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <h4 className="font-medium text-sm">Individual Signals</h4>
          {signals.map((signal) => (
            <div
              key={signal.id}
              className="flex items-center justify-between p-2 rounded border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedSignals.has(signal.id)}
                  onCheckedChange={() => handleSelectSignal(signal.id)}
                />
                <div>
                  <p className="font-medium text-sm">{signal.symbol}</p>
                  <p className="text-xs text-muted-foreground">{signal.strategy}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={signal.signalType === 'BUY' ? 'default' : 'secondary'} className="text-xs">
                  {signal.signalType}
                </Badge>
                <span className="text-xs text-muted-foreground">{signal.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}