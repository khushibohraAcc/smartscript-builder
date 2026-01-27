/**
 * React Hook for WebSocket execution updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  executionWebSocket, 
  type ConnectionStatus,
  type StepUpdateMessage,
  type ExecutionResult,
} from '@/services/api';

interface UseExecutionWebSocketOptions {
  onStepComplete?: (step: StepUpdateMessage) => void;
  onExecutionComplete?: (result: ExecutionResult) => void;
  onError?: (error: string) => void;
}

interface UseExecutionWebSocketReturn {
  connect: (executionId: string) => void;
  disconnect: () => void;
  status: ConnectionStatus;
  isConnected: boolean;
  currentExecutionId: string | null;
  steps: StepUpdateMessage[];
  result: ExecutionResult | null;
  error: string | null;
}

export function useExecutionWebSocket(
  options: UseExecutionWebSocketOptions = {}
): UseExecutionWebSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [steps, setSteps] = useState<StepUpdateMessage[]>([]);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const connect = useCallback((id: string) => {
    // Reset state for new connection
    setSteps([]);
    setResult(null);
    setError(null);
    setExecutionId(id);

    executionWebSocket.connect(id, {
      onConnectionChange: (newStatus) => {
        setStatus(newStatus);
      },
      onStepComplete: (step) => {
        setSteps((prev) => [...prev, step]);
        optionsRef.current.onStepComplete?.(step);
      },
      onExecutionComplete: (executionResult) => {
        setResult(executionResult);
        optionsRef.current.onExecutionComplete?.(executionResult);
      },
      onError: (errorMessage) => {
        setError(errorMessage);
        optionsRef.current.onError?.(errorMessage);
      },
    });
  }, []);

  const disconnect = useCallback(() => {
    executionWebSocket.disconnect();
    setStatus('disconnected');
    setExecutionId(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      executionWebSocket.disconnect();
    };
  }, []);

  return {
    connect,
    disconnect,
    status,
    isConnected: status === 'connected',
    currentExecutionId: executionId,
    steps,
    result,
    error,
  };
}
