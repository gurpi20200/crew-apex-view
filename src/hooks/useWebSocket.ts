import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

interface UseWebSocketOptions {
  url: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onStatusChange?: (status: WebSocketStatus) => void;
  autoConnect?: boolean;
}

interface UseWebSocketReturn {
  status: WebSocketStatus;
  send: (message: WebSocketMessage) => void;
  connect: () => void;
  disconnect: () => void;
  lastMessage: WebSocketMessage | null;
  connectionAttempts: number;
}

export function useWebSocket({
  url,
  reconnectAttempts = 5,
  reconnectInterval = 3000,
  heartbeatInterval = 30000,
  onMessage,
  onStatusChange,
  autoConnect = true
}: UseWebSocketOptions): UseWebSocketReturn {
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueue = useRef<WebSocketMessage[]>([]);

  const updateStatus = useCallback((newStatus: WebSocketStatus) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    
    heartbeatIntervalRef.current = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'heartbeat',
          payload: {},
          timestamp: Date.now()
        }));
      }
    }, heartbeatInterval);
  }, [heartbeatInterval]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  const processMessageQueue = useCallback(() => {
    while (messageQueue.current.length > 0 && ws.current?.readyState === WebSocket.OPEN) {
      const message = messageQueue.current.shift();
      if (message) {
        ws.current.send(JSON.stringify(message));
      }
    }
  }, []);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    updateStatus('connecting');
    
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        updateStatus('connected');
        setConnectionAttempts(0);
        startHeartbeat();
        processMessageQueue();
        
        toast({
          title: "Connected",
          description: "Real-time connection established",
          variant: "default"
        });
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          // Skip heartbeat responses
          if (message.type !== 'heartbeat') {
            onMessage?.(message);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        updateStatus('error');
      };

      ws.current.onclose = (event) => {
        stopHeartbeat();
        
        if (event.wasClean) {
          updateStatus('disconnected');
        } else {
          updateStatus('error');
          
          // Attempt reconnection
          if (connectionAttempts < reconnectAttempts) {
            setConnectionAttempts(prev => prev + 1);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log(`Reconnection attempt ${connectionAttempts + 1}/${reconnectAttempts}`);
              connect();
            }, reconnectInterval * Math.pow(1.5, connectionAttempts)); // Exponential backoff
            
            toast({
              title: "Connection Lost",
              description: `Reconnecting... (${connectionAttempts + 1}/${reconnectAttempts})`,
              variant: "destructive"
            });
          } else {
            toast({
              title: "Connection Failed",
              description: "Maximum reconnection attempts reached",
              variant: "destructive"
            });
          }
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      updateStatus('error');
    }
  }, [url, connectionAttempts, reconnectAttempts, reconnectInterval, updateStatus, startHeartbeat, processMessageQueue, onMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    stopHeartbeat();
    
    if (ws.current) {
      ws.current.close(1000, 'User initiated disconnect');
      ws.current = null;
    }
    
    updateStatus('disconnected');
    setConnectionAttempts(0);
  }, [stopHeartbeat, updateStatus]);

  const send = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      // Queue message for when connection is restored
      messageQueue.current.push(message);
      
      if (status === 'disconnected') {
        connect();
      }
    }
  }, [status, connect]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    status,
    send,
    connect,
    disconnect,
    lastMessage,
    connectionAttempts
  };
}