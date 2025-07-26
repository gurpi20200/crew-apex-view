import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { RealTimeCounter } from "@/components/shared/RealTimeCounter";
import { DataTable } from "@/components/shared/DataTable";
import { mockSystemHealth } from "@/data/mockData";
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  RefreshCw,
  Download,
  Server,
  Database,
  TrendingUp
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

function SystemOverviewCard() {
  const health = mockSystemHealth;
  const [uptime, setUptime] = useState("99d 15h 23m");

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate uptime counter
      setUptime("99d 15h 24m");
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getHealthScore = () => {
    switch (health.overall) {
      case 'excellent': return 95;
      case 'good': return 85;
      case 'warning': return 65;
      case 'critical': return 30;
      default: return 50;
    }
  };

  const getHealthColor = () => {
    switch (health.overall) {
      case 'excellent': return 'profit';
      case 'good': return 'profit';
      case 'warning': return 'warning';
      case 'critical': return 'loss';
      default: return 'neutral';
    }
  };

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Health Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold">
            <RealTimeCounter value={getHealthScore()} decimals={0} />
          </div>
          <div className={`text-lg font-medium ${getHealthColor()}-text capitalize`}>
            {health.overall}
          </div>
          <Progress value={getHealthScore()} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">System Uptime</p>
            <p className="font-mono font-medium">{uptime}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Check</p>
            <p className="font-medium">30 seconds ago</p>
          </div>
          <div>
            <p className="text-muted-foreground">Response Time</p>
            <p className="font-medium">
              <RealTimeCounter value={health.performance.responseTime} decimals={0} suffix="ms" />
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Availability</p>
            <p className="font-medium profit-text">{health.performance.uptime}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectionStatusGrid() {
  const health = mockSystemHealth;

  const connections = [
    {
      name: 'Alpaca Trading API',
      status: health.apiConnections.alpaca,
      icon: TrendingUp,
      latency: '45ms',
      lastCall: '5 seconds ago'
    },
    {
      name: 'Market Data Provider',
      status: health.apiConnections.dataProvider,
      icon: Database,
      latency: '78ms',
      lastCall: '2 seconds ago'
    },
    {
      name: 'News & Sentiment API',
      status: health.apiConnections.newsApi,
      icon: Wifi,
      latency: '120ms',
      lastCall: '1 minute ago'
    },
    {
      name: 'Database Connection',
      status: 'connected' as const,
      icon: Server,
      latency: '12ms',
      lastCall: '1 second ago'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {connections.map((conn, index) => (
        <Card key={index} className="trading-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <conn.icon className="h-4 w-4" />
                <span className="font-medium">{conn.name}</span>
              </div>
              <StatusIndicator status={conn.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Latency</p>
                <p className="font-mono">{conn.latency}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Call</p>
                <p>{conn.lastCall}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PerformanceMetrics() {
  const health = mockSystemHealth;

  const metrics = [
    {
      name: 'CPU Usage',
      value: health.performance.cpuUsage,
      icon: Cpu,
      color: health.performance.cpuUsage > 80 ? 'loss' : health.performance.cpuUsage > 60 ? 'warning' : 'profit'
    },
    {
      name: 'Memory Usage',
      value: health.performance.memoryUsage,
      icon: Activity,
      color: health.performance.memoryUsage > 80 ? 'loss' : health.performance.memoryUsage > 60 ? 'warning' : 'profit'
    },
    {
      name: 'Disk Usage',
      value: health.performance.diskUsage,
      icon: HardDrive,
      color: health.performance.diskUsage > 80 ? 'loss' : health.performance.diskUsage > 60 ? 'warning' : 'profit'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="trading-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <metric.icon className="h-4 w-4" />
              <span className="font-medium">{metric.name}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">
                  <RealTimeCounter value={metric.value} decimals={0} suffix="%" />
                </span>
                <Badge variant={metric.color === 'profit' ? 'default' : 'destructive'}>
                  {metric.color === 'profit' ? 'Normal' : metric.color === 'warning' ? 'High' : 'Critical'}
                </Badge>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const errorLogColumns: ColumnDef<any>[] = [
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => {
      const date = row.getValue("timestamp") as Date;
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => {
      const level = row.getValue("level") as string;
      const getVariant = () => {
        switch (level) {
          case 'error': return 'destructive';
          case 'warning': return 'secondary';
          default: return 'outline';
        }
      };
      return (
        <Badge variant={getVariant()} className="capitalize">
          {level}
        </Badge>
      );
    },
  },
  {
    accessorKey: "component",
    header: "Component",
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <div className="max-w-md truncate">
        {row.getValue("message")}
      </div>
    ),
  },
  {
    accessorKey: "resolved",
    header: "Status",
    cell: ({ row }) => {
      const resolved = row.getValue("resolved") as boolean;
      return resolved ? (
        <Badge variant="default" className="profit-text bg-profit/10">
          <CheckCircle className="h-3 w-3 mr-1" />
          Resolved
        </Badge>
      ) : (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Open
        </Badge>
      );
    },
  },
];

function TradingSystemHealth() {
  const health = mockSystemHealth;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="trading-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Orders Processed</span>
          </div>
          <p className="text-2xl font-bold">
            <RealTimeCounter value={health.trading.ordersProcessed} decimals={0} />
          </p>
          <p className="text-xs text-muted-foreground">Today</p>
        </CardContent>
      </Card>

      <Card className="trading-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Success Rate</span>
          </div>
          <p className="text-2xl font-bold profit-text">
            <RealTimeCounter value={health.trading.orderSuccessRate} decimals={1} suffix="%" />
          </p>
          <p className="text-xs text-muted-foreground">Last 24h</p>
        </CardContent>
      </Card>

      <Card className="trading-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Avg Execution</span>
          </div>
          <p className="text-2xl font-bold">
            <RealTimeCounter value={health.trading.avgExecutionTime} decimals={0} suffix="ms" />
          </p>
          <p className="text-xs text-muted-foreground">Per order</p>
        </CardContent>
      </Card>

      <Card className="trading-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last Trade</span>
          </div>
          <p className="text-lg font-bold">2 min ago</p>
          <p className="text-xs text-muted-foreground">AAPL +100 shares</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SystemHealth() {
  const [logLevel, setLogLevel] = useState("all");
  const [logComponent, setLogComponent] = useState("all");
  const health = mockSystemHealth;

  const filteredLogs = health.errorLogs.filter(log => {
    if (logLevel !== "all" && log.level !== logLevel) return false;
    if (logComponent !== "all" && log.component !== logComponent) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="text-muted-foreground">
            Monitor system performance and diagnose issues
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <SystemOverviewCard />
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">API Connections</h2>
          <ConnectionStatusGrid />
        </div>
      </div>

      {/* Performance Monitoring */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Resource Usage</h2>
        <PerformanceMetrics />
      </div>

      {/* Trading System Health */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Trading System Status</h2>
        <TradingSystemHealth />
      </div>

      {/* Logs and Alerts */}
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Error Logs</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card className="trading-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>System Logs</CardTitle>
                <div className="flex gap-2">
                  <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={logComponent} onValueChange={setLogComponent}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Components</SelectItem>
                      <SelectItem value="Trading Engine">Trading Engine</SelectItem>
                      <SelectItem value="Risk Engine">Risk Engine</SelectItem>
                      <SelectItem value="Data Provider">Data Provider</SelectItem>
                      <SelectItem value="Strategy Manager">Strategy Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={errorLogColumns}
                data={filteredLogs}
                searchKey="message"
                pageSize={15}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle>Active System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLogs.filter(log => !log.resolved).map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg">
                    <AlertCircle className="h-5 w-5 mt-0.5 text-destructive" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive" className="capitalize">
                          {alert.level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{alert.component}</span>
                      </div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Acknowledge
                    </Button>
                  </div>
                ))}
                {filteredLogs.filter(log => !log.resolved).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-profit" />
                    <p>No active alerts</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex-col">
                  <RefreshCw className="h-6 w-6 mb-2" />
                  Restart Trading Engine
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Wifi className="h-6 w-6 mb-2" />
                  Refresh Data Connections
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <HardDrive className="h-6 w-6 mb-2" />
                  Clear Cache
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Export Diagnostics
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Emergency Controls</h3>
                <div className="space-y-2">
                  <Button variant="destructive" className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Emergency System Shutdown
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    This will stop all trading activities and close the system safely.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}