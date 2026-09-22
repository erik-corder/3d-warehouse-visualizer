/**
 * Color tokens. Kept minimal for 3DW-STORY-001C: a light theme, a small
 * semantic status palette, and a dark variant for `theme.css`'s
 * `prefers-color-scheme` override.
 *
 * Note: these values and `../styles/theme.css`'s CSS custom properties
 * must currently be kept in sync by hand (no build-time generation step
 * exists yet) - a known, accepted simplicity tradeoff for this story's
 * scope. See implementation-summary.md, "Known limitations".
 */
export const colors = {
  light: {
    background: '#ffffff',
    surface: '#f5f5f7',
    textPrimary: '#1a1a1a',
    textSecondary: '#5f6368',
    border: '#e0e0e0',
  },
  dark: {
    background: '#121212',
    surface: '#1e1e1e',
    textPrimary: '#f5f5f7',
    textSecondary: '#b0b3b8',
    border: '#3a3a3a',
  },
  status: {
    connected: {
      background: '#e6f4ea',
      text: '#1e7e34',
      border: '#34a853',
    },
    loading: {
      background: '#f1f3f4',
      text: '#5f6368',
      border: '#dadce0',
    },
    notConnected: {
      background: '#fce8e6',
      text: '#c5221f',
      border: '#ea4335',
    },
  },
} as const;
