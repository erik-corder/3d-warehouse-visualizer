import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders the loading label with role="status"', () => {
    render(<StatusBadge status="loading" />);

    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Checking connection...');
  });

  it('renders the connected label', () => {
    render(<StatusBadge status="connected" />);

    expect(screen.getByRole('status')).toHaveTextContent('Connected');
  });

  it('renders the not-connected label', () => {
    render(<StatusBadge status="not-connected" />);

    expect(screen.getByRole('status')).toHaveTextContent('Not connected');
  });

  it('renders a distinct text label per status, not relying on color alone', () => {
    const { unmount: unmountLoading } = render(<StatusBadge status="loading" />);
    const loadingText = screen.getByRole('status').textContent;
    unmountLoading();

    const { unmount: unmountConnected } = render(<StatusBadge status="connected" />);
    const connectedText = screen.getByRole('status').textContent;
    unmountConnected();

    render(<StatusBadge status="not-connected" />);
    const notConnectedText = screen.getByRole('status').textContent;

    const labels = [loadingText, connectedText, notConnectedText];
    expect(new Set(labels).size).toBe(labels.length);
    labels.forEach((text) => expect(text).toBeTruthy());
  });
});
