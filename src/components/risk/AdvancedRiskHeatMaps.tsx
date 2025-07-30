import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface HeatMapCell {
  row: string;
  col: string;
  value: number;
  label?: string;
  percentage?: number;
}

interface AdvancedRiskHeatMapsProps {
  sectorData: HeatMapCell[];
  geographicData: HeatMapCell[];
  concentrationData: HeatMapCell[];
  timeData: HeatMapCell[];
}

const HeatMapGrid = ({ 
  data, 
  title, 
  showPercentages = true,
  colorScheme = "risk" 
}: { 
  data: HeatMapCell[]; 
  title: string;
  showPercentages?: boolean;
  colorScheme?: "risk" | "performance" | "neutral";
}) => {
  const rows = [...new Set(data.map(d => d.row))];
  const cols = [...new Set(data.map(d => d.col))];
  
  const getIntensityColor = (value: number, scheme: string) => {
    const intensity = Math.abs(value);
    const isPositive = value >= 0;
    
    if (scheme === "risk") {
      // Red gradient for risk (higher = more intense red)
      return `rgba(239, 68, 68, ${Math.min(intensity, 1)})`;
    } else if (scheme === "performance") {
      // Green for positive, red for negative
      return isPositive 
        ? `rgba(34, 197, 94, ${intensity})`
        : `rgba(239, 68, 68, ${intensity})`;
    } else {
      // Neutral blue gradient
      return `rgba(59, 130, 246, ${Math.min(intensity, 1)})`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="outline">{data.length} positions</Badge>
      </div>
      
      <div className="overflow-auto">
        <div className="min-w-[600px]">
          <div className="grid gap-1" style={{ 
            gridTemplateColumns: `120px repeat(${cols.length}, 1fr)` 
          }}>
            {/* Header */}
            <div></div>
            {cols.map(col => (
              <div key={col} className="text-xs font-medium text-center p-2 bg-muted rounded">
                {col}
              </div>
            ))}
            
            {/* Rows */}
            {rows.map(row => (
              <div key={row} className="contents">
                <div className="text-xs font-medium p-2 bg-muted rounded flex items-center">
                  {row}
                </div>
                {cols.map(col => {
                  const cell = data.find(d => d.row === row && d.col === col);
                  const value = cell?.value || 0;
                  const percentage = cell?.percentage;
                  
                  return (
                    <div
                      key={`${row}-${col}`}
                      className="p-2 text-xs font-medium text-center rounded border"
                      style={{
                        backgroundColor: getIntensityColor(value, colorScheme),
                        color: Math.abs(value) > 0.5 ? 'white' : 'inherit'
                      }}
                    >
                      {value !== 0 && (
                        <div>
                          <div>{value > 0 ? '+' : ''}{(value * 100).toFixed(1)}%</div>
                          {showPercentages && percentage && (
                            <div className="text-[10px] opacity-75">
                              {percentage.toFixed(1)}%
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdvancedRiskHeatMaps = ({
  sectorData,
  geographicData,
  concentrationData,
  timeData
}: AdvancedRiskHeatMapsProps) => {
  const [showPercentages, setShowPercentages] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'exposure' | 'var' | 'correlation'>('exposure');

  const metrics = [
    { id: 'exposure', label: 'Exposure', description: 'Position size distribution' },
    { id: 'var', label: 'VaR Contribution', description: 'Risk contribution by segment' },
    { id: 'correlation', label: 'Correlation', description: 'Cross-segment correlations' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Advanced Risk Heat Maps
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="percentages"
                checked={showPercentages}
                onCheckedChange={setShowPercentages}
              />
              <Label htmlFor="percentages" className="text-sm">
                Show percentages
              </Label>
            </div>
          </div>
        </CardTitle>
        <div className="flex gap-2">
          {metrics.map(metric => (
            <Button
              key={metric.id}
              variant={selectedMetric === metric.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric(metric.id as any)}
            >
              {metric.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sector" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sector">Sector Analysis</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
            <TabsTrigger value="concentration">Concentration</TabsTrigger>
            <TabsTrigger value="temporal">Temporal Risk</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sector" className="space-y-4">
            <HeatMapGrid
              data={sectorData}
              title="Sector Risk Distribution"
              showPercentages={showPercentages}
              colorScheme="risk"
            />
          </TabsContent>
          
          <TabsContent value="geographic" className="space-y-4">
            <HeatMapGrid
              data={geographicData}
              title="Geographic Risk Exposure"
              showPercentages={showPercentages}
              colorScheme="neutral"
            />
          </TabsContent>
          
          <TabsContent value="concentration" className="space-y-4">
            <HeatMapGrid
              data={concentrationData}
              title="Concentration Risk Analysis"
              showPercentages={showPercentages}
              colorScheme="risk"
            />
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Risk Concentration Alerts</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">High</Badge>
                  <span className="text-sm">Technology sector exposure above 40% threshold</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Medium</Badge>
                  <span className="text-sm">Single position risk exceeds 5% of portfolio</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="temporal" className="space-y-4">
            <HeatMapGrid
              data={timeData}
              title="Risk Evolution Over Time"
              showPercentages={showPercentages}
              colorScheme="performance"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};