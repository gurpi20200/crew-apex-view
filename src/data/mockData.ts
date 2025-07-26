import { TradingSignal, Position, RiskMetrics, Strategy, SystemHealth, Trade, PerformanceMetrics } from '@/types/trading';

// Mock Trading Signals
export const mockTradingSignals: TradingSignal[] = [
  {
    id: '1',
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    strategy: 'Momentum',
    signalType: 'BUY',
    strength: 8,
    confidence: 87,
    currentPrice: 178.50,
    targetPrice: 185.00,
    stopLoss: 172.00,
    expectedMove: 3.6,
    riskReward: 2.1,
    generatedAt: new Date(Date.now() - 15 * 60 * 1000),
    expiresAt: new Date(Date.now() + 3.5 * 60 * 60 * 1000),
    technicalIndicators: {
      rsi: 65.4,
      macd: 1.2,
      sma20: 176.8,
      sma50: 174.2,
      volume: 65000000,
      volumeRatio: 1.3
    },
    newssentiment: 0.7
  },
  {
    id: '2',
    symbol: 'TSLA',
    companyName: 'Tesla Inc.',
    strategy: 'Breakout',
    signalType: 'BUY',
    strength: 9,
    confidence: 92,
    currentPrice: 245.80,
    targetPrice: 265.00,
    stopLoss: 235.00,
    expectedMove: 7.8,
    riskReward: 1.8,
    generatedAt: new Date(Date.now() - 8 * 60 * 1000),
    expiresAt: new Date(Date.now() + 2.2 * 60 * 60 * 1000),
    technicalIndicators: {
      rsi: 72.1,
      macd: 2.5,
      sma20: 242.1,
      sma50: 238.7,
      volume: 85000000,
      volumeRatio: 1.8
    },
    newssentiment: 0.8
  },
  {
    id: '3',
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    strategy: 'Mean Reversion',
    signalType: 'SELL',
    strength: 6,
    confidence: 74,
    currentPrice: 412.30,
    targetPrice: 395.00,
    stopLoss: 420.00,
    expectedMove: -4.2,
    riskReward: 2.3,
    generatedAt: new Date(Date.now() - 32 * 60 * 1000),
    expiresAt: new Date(Date.now() + 1.8 * 60 * 60 * 1000),
    technicalIndicators: {
      rsi: 78.9,
      macd: -0.8,
      sma20: 408.5,
      sma50: 405.2,
      volume: 28000000,
      volumeRatio: 0.9
    },
    newssentiment: 0.4
  },
  {
    id: '4',
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    strategy: 'Sentiment',
    signalType: 'BUY',
    strength: 7,
    confidence: 81,
    currentPrice: 142.65,
    targetPrice: 150.00,
    stopLoss: 138.00,
    expectedMove: 5.2,
    riskReward: 1.6,
    generatedAt: new Date(Date.now() - 5 * 60 * 1000),
    expiresAt: new Date(Date.now() + 4.1 * 60 * 60 * 1000),
    technicalIndicators: {
      rsi: 58.3,
      macd: 0.9,
      sma20: 141.2,
      sma50: 139.8,
      volume: 32000000,
      volumeRatio: 1.1
    },
    newssentiment: 0.9
  },
  {
    id: '5',
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    strategy: 'Momentum',
    signalType: 'HOLD',
    strength: 5,
    confidence: 68,
    currentPrice: 875.20,
    targetPrice: 890.00,
    stopLoss: 860.00,
    expectedMove: 1.7,
    riskReward: 1.0,
    generatedAt: new Date(Date.now() - 45 * 60 * 1000),
    expiresAt: new Date(Date.now() + 0.8 * 60 * 60 * 1000),
    technicalIndicators: {
      rsi: 52.7,
      macd: 0.1,
      sma20: 872.3,
      sma50: 869.1,
      volume: 45000000,
      volumeRatio: 1.0
    },
    newssentiment: 0.6
  }
];

// Mock Risk Metrics
export const mockRiskMetrics: RiskMetrics = {
  portfolioVaR: {
    oneDay: -2850,
    fiveDay: -6420,
    twentyDay: -12800,
    confidence: 95
  },
  expectedShortfall: -4200,
  betaToMarket: 1.15,
  correlationMatrix: [
    [1.0, 0.65, 0.72, 0.58, 0.81],
    [0.65, 1.0, 0.43, 0.69, 0.52],
    [0.72, 0.43, 1.0, 0.61, 0.74],
    [0.58, 0.69, 0.61, 1.0, 0.45],
    [0.81, 0.52, 0.74, 0.45, 1.0]
  ],
  concentrationRisk: 0.28,
  leverageRatio: 1.05,
  maxDrawdown: -0.08,
  currentDrawdown: -0.025,
  sharpeRatio: 1.85,
  volatility: 0.16
};

// Mock Strategies
export const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'Momentum Strategy',
    description: 'Trend-following strategy using price momentum indicators',
    isActive: true,
    allocation: 35,
    performance: {
      totalReturn: 18.5,
      annualizedReturn: 22.3,
      sharpe: 1.95,
      maxDrawdown: -6.2,
      winRate: 68,
      totalTrades: 145
    },
    parameters: {
      lookbackPeriod: 20,
      momentumThreshold: 0.05,
      stopLoss: 0.08,
      takeProfit: 0.15
    },
    lastOptimized: new Date('2024-01-15'),
    nextOptimization: new Date('2024-02-15'),
    risk: {
      var95: -0.035,
      volatility: 0.18
    }
  },
  {
    id: '2',
    name: 'Mean Reversion',
    description: 'Contrarian strategy based on price reversions',
    isActive: true,
    allocation: 25,
    performance: {
      totalReturn: 12.8,
      annualizedReturn: 15.4,
      sharpe: 1.62,
      maxDrawdown: -4.1,
      winRate: 72,
      totalTrades: 89
    },
    parameters: {
      overboughtLevel: 70,
      oversoldLevel: 30,
      reversionPeriod: 14,
      exitThreshold: 0.03
    },
    lastOptimized: new Date('2024-01-20'),
    nextOptimization: new Date('2024-02-20'),
    risk: {
      var95: -0.028,
      volatility: 0.14
    }
  },
  {
    id: '3',
    name: 'Breakout Strategy',
    description: 'Captures momentum from price breakouts',
    isActive: true,
    allocation: 20,
    performance: {
      totalReturn: 24.2,
      annualizedReturn: 29.1,
      sharpe: 2.15,
      maxDrawdown: -8.5,
      winRate: 58,
      totalTrades: 67
    },
    parameters: {
      breakoutPeriod: 50,
      volumeConfirmation: 1.5,
      stopLoss: 0.12,
      trailingStop: 0.08
    },
    lastOptimized: new Date('2024-01-10'),
    nextOptimization: new Date('2024-02-10'),
    risk: {
      var95: -0.042,
      volatility: 0.22
    }
  },
  {
    id: '4',
    name: 'Sentiment Analysis',
    description: 'News and social sentiment-driven trading',
    isActive: false,
    allocation: 0,
    performance: {
      totalReturn: 8.9,
      annualizedReturn: 10.7,
      sharpe: 1.28,
      maxDrawdown: -5.3,
      winRate: 64,
      totalTrades: 112
    },
    parameters: {
      sentimentThreshold: 0.7,
      newsWeight: 0.6,
      socialWeight: 0.4,
      decayFactor: 0.95
    },
    lastOptimized: new Date('2024-01-05'),
    nextOptimization: new Date('2024-02-05'),
    risk: {
      var95: -0.031,
      volatility: 0.16
    }
  }
];

// Mock System Health
export const mockSystemHealth: SystemHealth = {
  overall: 'excellent',
  apiConnections: {
    alpaca: 'connected',
    dataProvider: 'connected',
    newsApi: 'connected'
  },
  performance: {
    cpuUsage: 24,
    memoryUsage: 68,
    diskUsage: 45,
    responseTime: 125,
    uptime: 99.97
  },
  trading: {
    ordersProcessed: 1247,
    orderSuccessRate: 99.2,
    avgExecutionTime: 85,
    lastTradeTime: new Date(Date.now() - 15 * 60 * 1000)
  },
  errorLogs: [
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      level: 'warning',
      message: 'High memory usage detected',
      component: 'Risk Engine',
      resolved: true
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      level: 'info',
      message: 'Strategy optimization completed',
      component: 'Strategy Manager',
      resolved: true
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      level: 'error',
      message: 'News API connection timeout',
      component: 'Data Provider',
      resolved: false
    }
  ]
};

// Mock Performance Metrics
export const mockPerformanceMetrics: PerformanceMetrics = {
  totalReturn: 18.5,
  annualizedReturn: 22.3,
  volatility: 16.8,
  sharpeRatio: 1.85,
  calmarRatio: 2.78,
  maxDrawdown: -8.2,
  winRate: 68.5,
  avgWin: 2.4,
  avgLoss: -1.3,
  profitFactor: 2.1,
  totalTrades: 245,
  avgHoldingPeriod: 3.2
};

// Mock Trade History
export const mockTrades: Trade[] = [
  {
    id: '1',
    date: new Date('2024-01-25T09:30:00Z'),
    symbol: 'AAPL',
    side: 'BUY',
    quantity: 100,
    entryPrice: 175.50,
    exitPrice: 178.80,
    pnl: 330,
    pnlPercent: 1.88,
    holdingPeriod: 2.5,
    strategy: 'Momentum',
    status: 'closed'
  },
  {
    id: '2',
    date: new Date('2024-01-24T14:15:00Z'),
    symbol: 'TSLA',
    side: 'BUY',
    quantity: 50,
    entryPrice: 240.20,
    exitPrice: 248.90,
    pnl: 435,
    pnlPercent: 3.62,
    holdingPeriod: 1.2,
    strategy: 'Breakout',
    status: 'closed'
  },
  {
    id: '3',
    date: new Date('2024-01-24T11:00:00Z'),
    symbol: 'MSFT',
    side: 'SELL',
    quantity: 25,
    entryPrice: 415.00,
    exitPrice: 408.50,
    pnl: 162.5,
    pnlPercent: 1.57,
    holdingPeriod: 0.8,
    strategy: 'Mean Reversion',
    status: 'closed'
  }
];