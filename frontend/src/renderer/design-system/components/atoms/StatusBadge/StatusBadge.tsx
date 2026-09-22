import styles from './StatusBadge.module.css';

/**
 * Connection status a `StatusBadge` can represent. Promoted from
 * 3DW-STORY-001B's inline `App.tsx` type to a shared design-system
 * contract, per this story's LLD.
 */
export type StatusBadgeStatus = 'loading' | 'connected' | 'not-connected';

const LABELS: Record<StatusBadgeStatus, string> = {
  loading: 'Checking connection...',
  connected: 'Connected',
  'not-connected': 'Not connected',
};

const STYLES_BY_STATUS: Record<StatusBadgeStatus, string> = {
  loading: styles.loading,
  connected: styles.connected,
  'not-connected': styles.notConnected,
};

export interface IStatusBadgeProps {
  /** Which connection state to render. */
  status: StatusBadgeStatus;
  /** Overrides the default text label, if a caller needs custom copy. */
  label?: string;
}

/**
 * A small, reusable status indicator. Always shows a text label - never
 * relies on color alone - so the state is distinguishable without color
 * perception (accessibility requirement from this story's acceptance
 * criteria).
 */
export function StatusBadge({ status, label }: IStatusBadgeProps): React.JSX.Element {
  return (
    <span role="status" className={`${styles.badge} ${STYLES_BY_STATUS[status]}`}>
      {label ?? LABELS[status]}
    </span>
  );
}
