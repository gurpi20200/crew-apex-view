export interface TradingSignal {
  id: string;
  symbol: string;
  companyName: string;
  strategy: 'Momentum' | 'Mean Reversion' | 'Breakout' | 'Sentiment';
  signalType: 'BUY' | 'SELL' | 'HOLD';
  strength: number; // 1-10
  confidence: number; // 0-100%
  currentPrice: number;
  targetPrice: number;
  stopLoss: number;
  expectedMove: number;
  riskReward: number;
  generatedAt: Date;
  expiresAt: Date;
  technicalIndicators: {
    rsi: number;
    macd: number;
    sma20: number;
    sma50: number;
    volume: number;
    volumeRatio: number;
  };
  newssentiment?: number;
}

export interface Position {
  id: string;
  symbol: string;
  companyName: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  weight: number;
  entryDate: Date;
  strategy: string;
  sector: string;
}

export interface RiskMetrics {
  portfolioVaR: {
    oneDay: number;
    fiveDay: number;
    twentyDay: number;
    confidence: number;
  };
  expectedShortfall: number;
  betaToMarket: number;
  correlationMatrix: number[][];
  concentrationRisk: number;
  leverageRatio: number;
  maxDrawdown: number;
  currentDrawdown: number;
  sharpeRatio: number;
  volatility: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  allocation: number;
  performance: {
    totalReturn: number;
    annualizedReturn: number;
    sharpe: number;
    maxDrawdown: number;
    winRate: number;
    totalTrades: number;
  };
  parameters: Record<string, number>;
  lastOptimized: Date;
  nextOptimization: Date;
  risk: {
    var95: number;
    volatility: number;
  };
}

export interface SystemHealth {
  overall: 'excellent' | 'good' | 'warning' | 'critical';
  apiConnections: {
    alpaca: 'connected' | 'disconnected' | 'error';
    dataProvider: 'connected' | 'disconnected' | 'error';
    newsApi: 'connected' | 'disconnected' | 'error';
  };
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    responseTime: number;
    uptime: number;
  };
  trading: {
    ordersProcessed: number;
    orderSuccessRate: number;
    avgExecutionTime: number;
    lastTradeTime: Date;
  };
  errorLogs: Array<{
    id: string;
    timestamp: Date;
    level: 'error' | 'warning' | 'info';
    message: string;
    component: string;
    resolved: boolean;
  }>;
}

export interface Trade {
  id: string;
  date: Date;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  pnl: number;
  pnlPercent: number;
  holdingPeriod: number;
  strategy: string;
  status: 'open' | 'closed';
}

export interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  totalTrades: number;
  avgHoldingPeriod: number;
}