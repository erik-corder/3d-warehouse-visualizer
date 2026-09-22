import './design-system/styles/theme.css';

import { useEffect, useState } from 'react';

import { StatusBadge, type StatusBadgeStatus } from './design-system/components/atoms/StatusBadge';

/**
 * Connection status to the backend API.
 *
 * Note (3DW-STORY-001C): now the shared `StatusBadgeStatus` type from the
 * design system, replacing 3DW-STORY-001B's local inline type. The values
 * are unchanged.
 */
type ConnectionState = StatusBadgeStatus;

interface HealthResponseBody {
  status: string;
}

// API base URL is read from configuration, not hardcoded (Twelve-Factor).
// A sensible local-dev default is used when the variable is unset. The
// exact env var name / default is flagged as an open question in
// low-level-design.md, to be settled before 3DW-STORY-001D wires Compose
// networking.
//
// In dev mode, requests go through the Vite dev-server proxy at /api
// (see electron.vite.config.ts) so the renderer's fetch is same-origin -
// the backend (3DW-STORY-001A) has no CORS policy, so a direct
// cross-origin fetch is blocked by the browser. Production builds are
// not proxied and still need that resolved separately (open question).
const apiBaseUrl: string = import.meta.env.DEV
  ? '/api'
  : ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5000');

const HEALTH_CHECK_TIMEOUT_MS = 5000;

function isHealthResponseBody(value: unknown): value is HealthResponseBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    typeof (value as { status: unknown }).status === 'string'
  );
}

export function App(): React.JSX.Element {
  const [connectionState, setConnectionState] = useState<ConnectionState>('loading');

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);

    async function checkHealth(): Promise<void> {
      try {
        const response = await fetch(`${apiBaseUrl}/health`, { signal: controller.signal });

        if (!response.ok) {
          setConnectionState('not-connected');
          return;
        }

        const body: unknown = await response.json();

        if (isHealthResponseBody(body) && body.status === 'ok') {
          setConnectionState('connected');
        } else {
          // 200 with an unexpected shape is not trusted as success.
          setConnectionState('not-connected');
        }
      } catch (error) {
        // Network error, timeout (AbortError), or malformed JSON.
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- development-only diagnostic
          console.error('Health check failed:', error);
        }
        setConnectionState('not-connected');
      }
    }

    void checkHealth();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return (
    <main>
      <h1>3D Warehouse Visualizer</h1>
      <StatusBadge status={connectionState} />
    </main>
  );
}
