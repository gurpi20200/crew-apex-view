import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changePercent?: number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
  children?: ReactNode;
}

export function MetricCard({
  title,
  value,
  change,
  changePercent,
  icon: Icon,
  trend = "neutral",
  className = "",
  children,
}: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "profit-text";
      case "down":
        return "loss-text";
      default:
        return "neutral-text";
    }
  };

  const formatChange = () => {
    if (!change && changePercent === undefined) return null;
    
    const sign = (changePercent || 0) >= 0 ? "+" : "";
    return (
      <div className={`text-sm font-medium ${getTrendColor()}`}>
        {change && <span>{change}</span>}
        {changePercent !== undefined && (
          <span className="ml-1">({sign}{changePercent.toFixed(2)}%)</span>
        )}
      </div>
    );
  };

  return (
    <Card className={`trading-card ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="trading-label">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="trading-metric mb-1 animate-counter">
          {typeof value === "number" 
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value)
            : value
          }
        </div>
        {formatChange()}
        {children}
      </CardContent>
    </Card>
  );
}