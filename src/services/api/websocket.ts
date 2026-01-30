/**
 * WebSocket Client - Real-time execution updates
 */

import { API_CONFIG, API_ENDPOINTS } from './config';
import type { WebSocketMessage, StepUpdateMessage, ExecutionResult } from './types';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface ExecutionWebSocketCallbacks {
  onStepComplete?: (step: StepUpdateMessage) => void;
  onExecutionComplete?: (result: ExecutionResult) => void;
  onError?: (error: string) => void;
  onConnectionChange?: (status: ConnectionStatus) => void;
}

class ExecutionWebSocket {
  private ws: WebSocket | null = null;
  private executionId: string | null = null;
  private callbacks: ExecutionWebSocketCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Connect to execution WebSocket for real-time updates
   */
  connect(executionId: string, callbacks: ExecutionWebSocketCallbacks): void {
    this.executionId = executionId;
    this.callbacks = callbacks;
    this.reconnectAttempts = 0;
    
    this.establishConnection();
  }

  private establishConnection(): void {
    if (!this.executionId) return;

    const wsUrl = `${API_CONFIG.WS_URL}${API_ENDPOINTS.EXECUTION_WS(this.executionId)}`;
    
    this.callbacks.onConnectionChange?.('connecting');
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log(`[WS] Connected to execution: ${this.executionId}`);
        this.reconnectAttempts = 0;
        this.callbacks.onConnectionChange?.('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('[WS] Failed to parse message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log(`[WS] Connection closed: ${event.code} ${event.reason}`);
        this.handleDisconnect();
      };

      this.ws.onerror = (error) => {
        console.error('[WS] Connection error:', error);
        this.callbacks.onConnectionChange?.('error');
        this.callbacks.onError?.('WebSocket connection error');
      };
    } catch (error) {
      console.error('[WS] Failed to create WebSocket:', error);
      this.callbacks.onConnectionChange?.('error');
      this.callbacks.onError?.('Failed to establish WebSocket connection');
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'step_complete':
        this.callbacks.onStepComplete?.(message.data as unknown as StepUpdateMessage);
        break;
      
      case 'execution_complete':
        this.callbacks.onExecutionComplete?.(message.data as unknown as ExecutionResult);
        // Auto-disconnect on completion
        this.disconnect();
        break;
      
      case 'error':
        this.callbacks.onError?.(message.data.message as string || 'Unknown error');
        break;
      
      default:
        console.warn('[WS] Unknown message type:', message.type);
    }
  }

  private handleDisconnect(): void {
    this.callbacks.onConnectionChange?.('disconnected');
    
    // Attempt reconnect if not manually disconnected
    if (this.executionId && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      
      console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.establishConnection();
      }, delay);
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.executionId = null;
    this.callbacks = {};
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
  }

  /**
   * Check if currently connected
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get current execution ID
   */
  get currentExecutionId(): string | null {
    return this.executionId;
  }
}

// Export singleton instance
export const executionWebSocket = new ExecutionWebSocket();
