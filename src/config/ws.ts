/**
 * Single source of truth for WebSocket + WS-backed HTTP endpoints.
 * Priority:
 * 1. VITE_WS_API_URL
 * 2. VITE_WS_URL
 * 3. fallback localhost:3001
 */
function resolveBase(): string {
  const api = import.meta.env.VITE_WS_API_URL;
  const ws = import.meta.env.VITE_WS_URL;

  if (api && api.trim().length > 0) {
    return api;
  }

  if (ws && ws.trim().length > 0) {
    return ws;
  }

  return 'http://localhost:3001';
}

export const WS_API_BASE: string = resolveBase();
export const WS_SOCKET_URL: string = WS_API_BASE;
