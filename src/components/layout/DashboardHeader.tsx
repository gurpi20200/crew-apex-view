import { useState, useEffect } from "react";
import { Bell, Power, Wifi, WifiOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardHeaderProps {
  portfolioValue: number;
  dailyPnL: number;
  dailyPnLPercent: number;
}

export function DashboardHeader({
  portfolioValue = 125000,
  dailyPnL = 2500,
  dailyPnLPercent = 2.04,
}: DashboardHeaderProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [notifications, setNotifications] = useState(3);

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% connected
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? "+" : "";
    return `${sign}${percent.toFixed(2)}%`;
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2 text-success">
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-danger">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Disconnected</span>
            </div>
          )}
        </div>
      </div>

      {/* Real-time P&L Display */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6">
          <div className="text-center">
            <div className="trading-label">Portfolio Value</div>
            <div className="trading-metric">{formatCurrency(portfolioValue)}</div>
          </div>
          
          <div className="text-center">
            <div className="trading-label">Daily P&L</div>
            <div 
              className={`trading-metric ${
                dailyPnL >= 0 ? "profit-text" : "loss-text"
              }`}
            >
              {formatCurrency(dailyPnL)} ({formatPercent(dailyPnLPercent)})
            </div>
          </div>
        </div>

        {/* Emergency Stop Button */}
        <Button
          variant="destructive"
          size="sm"
          className="bg-gradient-danger hover:bg-danger/90 font-semibold animate-pulse-glow"
        >
          <Power className="h-4 w-4 mr-2" />
          STOP
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <div className="font-medium">New Buy Signal: AAPL</div>
                <div className="text-sm text-muted-foreground">
                  Strategy: Momentum - Confidence: 85%
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <div className="font-medium">Risk Alert: Portfolio Drawdown</div>
                <div className="text-sm text-muted-foreground">
                  Current drawdown: 3.2% (Warning threshold)
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <div className="font-medium">Trade Executed: TSLA</div>
                <div className="text-sm text-muted-foreground">
                  Sold 50 shares at $245.30
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/trader.png" alt="Trader" />
                <AvatarFallback>TR</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Alex Trader</p>
                <p className="text-xs leading-none text-muted-foreground">
                  alex@tradingbot.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Power className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}