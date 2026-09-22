import '@testing-library/jest-dom/vitest';

import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('shows the loading state before the health check resolves', () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    render(<App />);

    expect(screen.getByText('Checking connection...')).toBeInTheDocument();
  });

  it('shows "Connected" when the health check succeeds', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok' }),
    });

    render(<App />);

    await waitFor(() => expect(screen.getByText('Connected')).toBeInTheDocument());
  });

  it('shows "Not connected" on a network error', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new TypeError('Failed to fetch'),
    );

    render(<App />);

    await waitFor(() => expect(screen.getByText('Not connected')).toBeInTheDocument());
  });

  it('shows "Not connected" on a non-200 response', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ status: 'ok' }),
    });

    render(<App />);

    await waitFor(() => expect(screen.getByText('Not connected')).toBeInTheDocument());
  });

  it('shows "Not connected" on a malformed response body', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ unexpected: 'shape' }),
    });

    render(<App />);

    await waitFor(() => expect(screen.getByText('Not connected')).toBeInTheDocument());
  });
});
