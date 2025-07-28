import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TradingSignal } from "@/types/trading";
import { 
  Search, 
  Brain, 
  Filter, 
  RotateCcw, 
  Star,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Zap
} from "lucide-react";

interface FilterCriteria {
  searchTerm: string;
  minConfidence: number;
  maxConfidence: number;
  minStrength: number;
  maxStrength: number;
  signalTypes: string[];
  strategies: string[];
  minRiskReward: number;
  maxTimeToExpiry: number; // in hours
  aiRanking: boolean;
  sentimentFilter: boolean;
  technicalStrengthFilter: boolean;
}

interface IntelligentSignalFilterProps {
  signals: TradingSignal[];
  onFilteredSignalsChange: (filteredSignals: TradingSignal[]) => void;
  onCriteriaChange: (criteria: FilterCriteria) => void;
}

export function IntelligentSignalFilter({ 
  signals, 
  onFilteredSignalsChange, 
  onCriteriaChange 
}: IntelligentSignalFilterProps) {
  const [criteria, setCriteria] = useState<FilterCriteria>({
    searchTerm: '',
    minConfidence: 0,
    maxConfidence: 100,
    minStrength: 1,
    maxStrength: 10,
    signalTypes: [],
    strategies: [],
    minRiskReward: 0,
    maxTimeToExpiry: 24,
    aiRanking: false,
    sentimentFilter: false,
    technicalStrengthFilter: false
  });

  const [presets] = useState([
    {
      name: 'High Confidence',
      criteria: { ...criteria, minConfidence: 85, minStrength: 7, aiRanking: true }
    },
    {
      name: 'Quick Trades',
      criteria: { ...criteria, maxTimeToExpiry: 2, minRiskReward: 1.5 }
    },
    {
      name: 'Conservative',
      criteria: { ...criteria, minConfidence: 75, minRiskReward: 2.0, sentimentFilter: true }
    },
    {
      name: 'Momentum Only',
      criteria: { ...criteria, strategies: ['Momentum'], signalTypes: ['BUY'] }
    }
  ]);

  // AI-powered signal ranking algorithm
  const calculateAIScore = (signal: TradingSignal): number => {
    let score = 0;
    
    // Base confidence and strength
    score += signal.confidence * 0.3;
    score += signal.strength * 5;
    
    // Risk/reward bonus
    score += Math.min(signal.riskReward * 10, 30);
    
    // Technical indicators boost
    const { technicalIndicators } = signal;
    if (signal.signalType === 'BUY') {
      if (technicalIndicators.rsi < 70) score += 10;
      if (technicalIndicators.macd > 0) score += 10;
      if (technicalIndicators.volumeRatio > 1.2) score += 15;
    } else if (signal.signalType === 'SELL') {
      if (technicalIndicators.rsi > 30) score += 10;
      if (technicalIndicators.macd < 0) score += 10;
      if (technicalIndicators.volumeRatio > 1.2) score += 15;
    }
    
    // News sentiment boost
    if (signal.newssentiment) {
      score += signal.newssentiment * 20;
    }
    
    // Time urgency factor
    const timeToExpiry = (signal.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60);
    if (timeToExpiry < 1) score += 20; // Urgent signals get boost
    
    return Math.min(score, 100);
  };

  const applyFilters = (currentCriteria: FilterCriteria) => {
    let filtered = [...signals];

    // Text search
    if (currentCriteria.searchTerm) {
      const search = currentCriteria.searchTerm.toLowerCase();
      filtered = filtered.filter(signal => 
        signal.symbol.toLowerCase().includes(search) ||
        signal.companyName.toLowerCase().includes(search) ||
        signal.strategy.toLowerCase().includes(search)
      );
    }

    // Confidence range
    filtered = filtered.filter(signal => 
      signal.confidence >= currentCriteria.minConfidence &&
      signal.confidence <= currentCriteria.maxConfidence
    );

    // Strength range
    filtered = filtered.filter(signal => 
      signal.strength >= currentCriteria.minStrength &&
      signal.strength <= currentCriteria.maxStrength
    );

    // Signal types
    if (currentCriteria.signalTypes.length > 0) {
      filtered = filtered.filter(signal => 
        currentCriteria.signalTypes.includes(signal.signalType)
      );
    }

    // Strategies
    if (currentCriteria.strategies.length > 0) {
      filtered = filtered.filter(signal => 
        currentCriteria.strategies.includes(signal.strategy)
      );
    }

    // Risk/reward ratio
    filtered = filtered.filter(signal => 
      signal.riskReward >= currentCriteria.minRiskReward
    );

    // Time to expiry
    const maxExpiryTime = Date.now() + (currentCriteria.maxTimeToExpiry * 60 * 60 * 1000);
    filtered = filtered.filter(signal => 
      signal.expiresAt.getTime() <= maxExpiryTime
    );

    // Sentiment filter
    if (currentCriteria.sentimentFilter) {
      filtered = filtered.filter(signal => 
        signal.newssentiment && signal.newssentiment > 0.5
      );
    }

    // Technical strength filter
    if (currentCriteria.technicalStrengthFilter) {
      filtered = filtered.filter(signal => {
        const { technicalIndicators } = signal;
        if (signal.signalType === 'BUY') {
          return technicalIndicators.rsi < 70 && 
                 technicalIndicators.macd > 0 && 
                 technicalIndicators.volumeRatio > 1.1;
        } else if (signal.signalType === 'SELL') {
          return technicalIndicators.rsi > 30 && 
                 technicalIndicators.macd < 0 && 
                 technicalIndicators.volumeRatio > 1.1;
        }
        return true;
      });
    }

    // AI ranking
    if (currentCriteria.aiRanking) {
      filtered = filtered
        .map(signal => ({ ...signal, aiScore: calculateAIScore(signal) }))
        .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
    }

    return filtered;
  };

  useEffect(() => {
    const filteredSignals = applyFilters(criteria);
    onFilteredSignalsChange(filteredSignals);
    onCriteriaChange(criteria);
  }, [criteria, signals]);

  const updateCriteria = (updates: Partial<FilterCriteria>) => {
    setCriteria(prev => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setCriteria({
      searchTerm: '',
      minConfidence: 0,
      maxConfidence: 100,
      minStrength: 1,
      maxStrength: 10,
      signalTypes: [],
      strategies: [],
      minRiskReward: 0,
      maxTimeToExpiry: 24,
      aiRanking: false,
      sentimentFilter: false,
      technicalStrengthFilter: false
    });
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setCriteria(preset.criteria);
  };

  const uniqueStrategies = [...new Set(signals.map(s => s.strategy))];
  const filteredCount = applyFilters(criteria).length;

  return (
    <Card className="trading-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Intelligent Signal Filter
          </CardTitle>
          <Badge variant="secondary">
            {filteredCount} of {signals.length} signals
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Presets */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick Presets</Label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
                className="flex items-center gap-1"
              >
                <Star className="h-3 w-3" />
                {preset.name}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>
        </div>

        <Separator />

        {/* Search and Basic Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symbols, companies, or strategies..."
              value={criteria.searchTerm}
              onChange={(e) => updateCriteria({ searchTerm: e.target.value })}
              className="flex-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={criteria.signalTypes.length === 1 ? criteria.signalTypes[0] : 'all'}
              onValueChange={(value) => 
                updateCriteria({ 
                  signalTypes: value === 'all' ? [] : [value] 
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Signal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BUY">BUY Only</SelectItem>
                <SelectItem value="SELL">SELL Only</SelectItem>
                <SelectItem value="HOLD">HOLD Only</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={criteria.strategies.length === 1 ? criteria.strategies[0] : 'all'}
              onValueChange={(value) => 
                updateCriteria({ 
                  strategies: value === 'all' ? [] : [value] 
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strategies</SelectItem>
                {uniqueStrategies.map(strategy => (
                  <SelectItem key={strategy} value={strategy}>
                    {strategy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Advanced Filters */}
        <div className="space-y-6">
          <h4 className="font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </h4>

          {/* Confidence Range */}
          <div className="space-y-2">
            <Label className="text-sm">
              Confidence: {criteria.minConfidence}% - {criteria.maxConfidence}%
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Slider
                value={[criteria.minConfidence]}
                onValueChange={([value]) => updateCriteria({ minConfidence: value })}
                max={100}
                step={5}
                className="flex-1"
              />
              <Slider
                value={[criteria.maxConfidence]}
                onValueChange={([value]) => updateCriteria({ maxConfidence: value })}
                max={100}
                step={5}
                className="flex-1"
              />
            </div>
          </div>

          {/* Strength Range */}
          <div className="space-y-2">
            <Label className="text-sm">
              Strength: {criteria.minStrength} - {criteria.maxStrength}
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Slider
                value={[criteria.minStrength]}
                onValueChange={([value]) => updateCriteria({ minStrength: value })}
                min={1}
                max={10}
                step={1}
                className="flex-1"
              />
              <Slider
                value={[criteria.maxStrength]}
                onValueChange={([value]) => updateCriteria({ maxStrength: value })}
                min={1}
                max={10}
                step={1}
                className="flex-1"
              />
            </div>
          </div>

          {/* Risk/Reward and Time Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Min Risk/Reward: {criteria.minRiskReward.toFixed(1)}</Label>
              <Slider
                value={[criteria.minRiskReward]}
                onValueChange={([value]) => updateCriteria({ minRiskReward: value })}
                min={0}
                max={5}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Max Time to Expiry: {criteria.maxTimeToExpiry}h</Label>
              <Slider
                value={[criteria.maxTimeToExpiry]}
                onValueChange={([value]) => updateCriteria({ maxTimeToExpiry: value })}
                min={1}
                max={24}
                step={1}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* AI and Smart Filters */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Smart Filters
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <Label htmlFor="ai-ranking">AI-Powered Ranking</Label>
              </div>
              <Switch
                id="ai-ranking"
                checked={criteria.aiRanking}
                onCheckedChange={(checked) => updateCriteria({ aiRanking: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-profit" />
                <Label htmlFor="sentiment-filter">Positive Sentiment Only</Label>
              </div>
              <Switch
                id="sentiment-filter"
                checked={criteria.sentimentFilter}
                onCheckedChange={(checked) => updateCriteria({ sentimentFilter: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <Label htmlFor="technical-filter">Strong Technical Signals</Label>
              </div>
              <Switch
                id="technical-filter"
                checked={criteria.technicalStrengthFilter}
                onCheckedChange={(checked) => updateCriteria({ technicalStrengthFilter: checked })}
              />
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        {filteredCount !== signals.length && (
          <div className="p-3 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredCount}</span> of{' '}
              <span className="font-medium text-foreground">{signals.length}</span> signals
              {criteria.aiRanking && (
                <span className="ml-2">
                  <Badge variant="secondary" className="text-xs">
                    AI Ranked
                  </Badge>
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}