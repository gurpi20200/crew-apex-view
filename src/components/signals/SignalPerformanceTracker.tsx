import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Award, BarChart3 } from "lucide-react";

interface SignalPerformanceData {
  strategy: string;
  totalSignals: number;
  successRate: number;
  avgReturn: number;
  avgHoldTime: number;
  lastWeekPerformance: number;
  confidenceAccuracy: number;
  bestPerformer: string;
}

interface SignalPerformanceTrackerProps {
  data: SignalPerformanceData[];
}

export function SignalPerformanceTracker({ data }: SignalPerformanceTrackerProps) {
  const overallStats = data.reduce((acc, curr) => ({
    totalSignals: acc.totalSignals + curr.totalSignals,
    avgSuccessRate: acc.avgSuccessRate + curr.successRate,
    avgReturn: acc.avgReturn + curr.avgReturn,
    avgConfidenceAccuracy: acc.avgConfidenceAccuracy + curr.confidenceAccuracy
  }), { totalSignals: 0, avgSuccessRate: 0, avgReturn: 0, avgConfidenceAccuracy: 0 });

  const statCount = data.length;
  overallStats.avgSuccessRate /= statCount;
  overallStats.avgReturn /= statCount;
  overallStats.avgConfidenceAccuracy /= statCount;

  return (
    <div className="space-y-4">
      {/* Overall Performance Summary */}
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Signal Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-profit">{overallStats.totalSignals}</p>
              <p className="text-sm text-muted-foreground">Total Signals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-profit">{overallStats.avgSuccessRate.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-profit">+{overallStats.avgReturn.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Avg Return</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{overallStats.avgConfidenceAccuracy.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Confidence Accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((strategy, index) => (
          <Card key={index} className="trading-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{strategy.strategy}</CardTitle>
                <Badge variant={strategy.successRate > 70 ? "default" : "secondary"}>
                  {strategy.bestPerformer && <Award className="h-3 w-3 mr-1" />}
                  {strategy.successRate.toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Success Rate Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Success Rate</span>
                  <span>{strategy.successRate.toFixed(1)}%</span>
                </div>
                <Progress value={strategy.successRate} className="h-2" />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Signals</p>
                  <p className="font-medium">{strategy.totalSignals}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Return</p>
                  <p className={`font-medium ${strategy.avgReturn > 0 ? 'text-profit' : 'text-loss'}`}>
                    {strategy.avgReturn > 0 ? '+' : ''}{strategy.avgReturn.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Hold Time</p>
                  <p className="font-medium">{strategy.avgHoldTime.toFixed(1)}h</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Week Performance</p>
                  <div className="flex items-center gap-1">
                    {strategy.lastWeekPerformance > 0 ? (
                      <TrendingUp className="h-3 w-3 text-profit" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-loss" />
                    )}
                    <span className={`font-medium ${strategy.lastWeekPerformance > 0 ? 'text-profit' : 'text-loss'}`}>
                      {strategy.lastWeekPerformance > 0 ? '+' : ''}{strategy.lastWeekPerformance.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Confidence Accuracy */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Confidence Accuracy
                  </span>
                  <span>{strategy.confidenceAccuracy.toFixed(1)}%</span>
                </div>
                <Progress value={strategy.confidenceAccuracy} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}