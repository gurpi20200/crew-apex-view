import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from './useWebSocket';
import type { TradingSignal, Position, RiskMetrics, SystemHealth } from '@/types/trading';

interface RealTimeDataState {
  portfolioValue: number;
  dailyPnL: number;
  positions: Position[];
  signals: TradingSignal[];
  riskMetrics: RiskMetrics | null;
  systemHealth: SystemHealth | null;
  lastUpdate: Date | null;
}

interface OptimisticUpdate<T> {
  id: string;
  type: string;
  data: T;
  timestamp: number;
  applied: boolean;
}

export function useRealTimeData() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<RealTimeDataState>({
    portfolioValue: 0,
    dailyPnL: 0,
    positions: [],
    signals: [],
    riskMetrics: null,
    systemHealth: null,
    lastUpdate: null
  });
  
  const [optimisticUpdates, setOptimisticUpdates] = useState<OptimisticUpdate<any>[]>([]);
  const [connectionHealth, setConnectionHealth] = useState({
    status: 'disconnected' as const,
    latency: 0,
    lastHeartbeat: null as Date | null
  });

  const handleMessage = useCallback((message: any) => {
    const { type, payload, timestamp } = message;
    
    // Update connection health
    setConnectionHealth(prev => ({
      ...prev,
      latency: Date.now() - timestamp,
      lastHeartbeat: new Date()
    }));

    switch (type) {
      case 'portfolio_update':
        setData(prev => ({
          ...prev,
          portfolioValue: payload.portfolioValue,
          dailyPnL: payload.dailyPnL,
          positions: payload.positions,
          lastUpdate: new Date()
        }));
        
        // Update React Query cache
        queryClient.setQueryData(['portfolio'], payload);
        break;

      case 'price_update':
        setData(prev => ({
          ...prev,
          positions: prev.positions.map(position => 
            position.symbol === payload.symbol 
              ? { 
                  ...position, 
                  currentPrice: payload.price,
                  dayChange: payload.change,
                  marketValue: position.quantity * payload.price,
                  unrealizedPnL: (payload.price - position.avgPrice) * position.quantity
                }
              : position
          ),
          lastUpdate: new Date()
        }));
        break;

      case 'new_signal':
        setData(prev => ({
          ...prev,
          signals: [payload, ...prev.signals.slice(0, 19)], // Keep last 20
          lastUpdate: new Date()
        }));
        
        queryClient.setQueryData(['signals'], (old: TradingSignal[] = []) => 
          [payload, ...old.slice(0, 19)]
        );
        break;

      case 'signal_expired':
        setData(prev => ({
          ...prev,
          signals: prev.signals.filter(signal => signal.id !== payload.signalId),
          lastUpdate: new Date()
        }));
        break;

      case 'risk_update':
        setData(prev => ({
          ...prev,
          riskMetrics: payload,
          lastUpdate: new Date()
        }));
        
        queryClient.setQueryData(['risk-metrics'], payload);
        break;

      case 'system_health':
        setData(prev => ({
          ...prev,
          systemHealth: payload,
          lastUpdate: new Date()
        }));
        
        queryClient.setQueryData(['system-health'], payload);
        break;

      case 'trade_executed':
        // Apply optimistic update confirmation
        setOptimisticUpdates(prev => 
          prev.map(update => 
            update.id === payload.orderId 
              ? { ...update, applied: true }
              : update
          )
        );
        
        // Update positions based on trade execution
        setData(prev => ({
          ...prev,
          positions: updatePositionsFromTrade(prev.positions, payload),
          lastUpdate: new Date()
        }));
        break;

      case 'error':
        console.error('Real-time error:', payload);
        // Remove failed optimistic updates
        setOptimisticUpdates(prev => 
          prev.filter(update => update.id !== payload.requestId)
        );
        break;
    }
  }, [queryClient]);

  const handleStatusChange = useCallback((status: any) => {
    setConnectionHealth(prev => ({ ...prev, status }));
  }, []);

  const { status, send, connect, disconnect } = useWebSocket({
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
    onMessage: handleMessage,
    onStatusChange: handleStatusChange,
    reconnectAttempts: 5,
    reconnectInterval: 3000
  });

  // Optimistic updates for immediate UI feedback
  const applyOptimisticUpdate = useCallback(<T>(
    type: string,
    data: T,
    updateFn: (currentData: RealTimeDataState, data: T) => RealTimeDataState
  ) => {
    const updateId = `${type}_${Date.now()}_${Math.random()}`;
    
    // Apply update immediately to local state
    setData(prev => updateFn(prev, data));
    
    // Track the optimistic update
    setOptimisticUpdates(prev => [...prev, {
      id: updateId,
      type,
      data,
      timestamp: Date.now(),
      applied: false
    }]);

    return updateId;
  }, []);

  // Rollback optimistic update if it fails
  const rollbackOptimisticUpdate = useCallback((updateId: string) => {
    const update = optimisticUpdates.find(u => u.id === updateId);
    if (!update) return;

    // Remove the failed update
    setOptimisticUpdates(prev => prev.filter(u => u.id !== updateId));
    
    // Force refresh from server
    queryClient.invalidateQueries({ queryKey: [update.type] });
  }, [optimisticUpdates, queryClient]);

  // Clean up old optimistic updates
  useEffect(() => {
    const cleanup = setInterval(() => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      setOptimisticUpdates(prev => 
        prev.filter(update => update.timestamp > fiveMinutesAgo)
      );
    }, 60000); // Clean up every minute

    return () => clearInterval(cleanup);
  }, []);

  return {
    data,
    connectionHealth,
    status,
    connect,
    disconnect,
    send,
    applyOptimisticUpdate,
    rollbackOptimisticUpdate,
    pendingUpdates: optimisticUpdates.filter(u => !u.applied).length
  };
}

// Helper function to update positions from trade execution
function updatePositionsFromTrade(positions: Position[], trade: any): Position[] {
  const existingPosition = positions.find(p => p.symbol === trade.symbol);
  
  if (!existingPosition) {
    // New position
    return [...positions, {
      id: trade.symbol,
      symbol: trade.symbol,
      companyName: trade.companyName || trade.symbol,
      quantity: trade.quantity,
      avgPrice: trade.price,
      currentPrice: trade.price,
      marketValue: trade.quantity * trade.price,
      unrealizedPnL: 0,
      unrealizedPnLPercent: 0,
      dayChange: 0,
      dayChangePercent: 0,
      weight: 0, // Will be calculated by backend
      entryDate: new Date(trade.timestamp),
      strategy: trade.strategy || 'Manual',
      sector: trade.sector || 'Unknown'
    }];
  } else {
    // Update existing position
    const newQuantity = existingPosition.quantity + trade.quantity;
    const newAvgPrice = newQuantity === 0 ? 0 : 
      ((existingPosition.avgPrice * existingPosition.quantity) + (trade.price * trade.quantity)) / newQuantity;
    
    return positions.map(p => 
      p.symbol === trade.symbol 
        ? {
            ...p,
            quantity: newQuantity,
            avgPrice: newAvgPrice,
            marketValue: newQuantity * p.currentPrice,
            unrealizedPnL: (p.currentPrice - newAvgPrice) * newQuantity
          }
        : p
    ).filter(p => p.quantity !== 0); // Remove positions with zero quantity
  }
}