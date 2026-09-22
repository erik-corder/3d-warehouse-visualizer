/**
 * Typography tokens. A small, system-font-based scale - no web font is
 * added, to avoid a new dependency and keep the app lightweight.
 */
export const typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontSize: {
    sm: '13px',
    md: '15px',
    lg: '20px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
} as const;
