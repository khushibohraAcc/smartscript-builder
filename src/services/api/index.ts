/**
 * API Service - Main export
 */

export { apiClient, ApiRequestError } from './client';
export { executionWebSocket } from './websocket';
export { API_CONFIG, API_ENDPOINTS } from './config';
export type { ConnectionStatus, ExecutionWebSocketCallbacks } from './websocket';
export * from './types';
