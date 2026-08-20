export const Nexorbit_TOKENS = {
  colors: {
    // Light Canvas Foundation
    background: '#F8FAFC', // Slate 50
    surface: '#FFFFFF',
    elevatedSurface: '#FFFFFF',
    glassSurface: 'rgba(255, 255, 255, 0.75)',
    softSurface: '#F1F5F9', // Slate 100

    // Typography
    primaryText: '#0F172A', // Slate 900 (Near-black)
    secondaryText: '#475569', // Slate 600
    mutedText: '#94A3B8', // Slate 400

    // Borders & Dividers
    border: '#E2E8F0', // Slate 200
    borderSubtle: '#F1F5F9', // Slate 100
    borderFocus: '#6366F1', // Indigo 500

    // AI Accent (Subtle Blue / Indigo / Violet)
    accent: '#6366F1', // Indigo 500
    accentHover: '#4F46E5', // Indigo 600
    accentLight: '#EEF2FF', // Indigo 50
    accentBorder: '#C7D2FE', // Indigo 200
    aiGlow: 'rgba(99, 102, 241, 0.12)',

    // Functional Colors
    success: '#10B981', // Emerald 500
    successBg: '#ECFDF5', // Emerald 50
    warning: '#F59E0B', // Amber 500
    warningBg: '#FFFBEB', // Amber 50
    danger: '#EF4444', // Red 500
    dangerBg: '#FEF2F2', // Red 50
  },

  typography: {
    fontFamily: {
      sans: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    display: {
      fontSize: '2.25rem', // 36px
      lineHeight: '2.75rem',
      fontWeight: '700',
      letterSpacing: '-0.025em',
    },
    heading: {
      fontSize: '1.5rem', // 24px
      lineHeight: '2rem',
      fontWeight: '600',
      letterSpacing: '-0.02em',
    },
    subheading: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.625rem',
      fontWeight: '600',
      letterSpacing: '-0.01em',
    },
    body: {
      fontSize: '1rem', // 16px
      lineHeight: '1.5rem',
      fontWeight: '400',
      letterSpacing: '0em',
    },
    small: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.25rem',
      fontWeight: '400',
      letterSpacing: '0em',
    },
    caption: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1rem',
      fontWeight: '400',
      letterSpacing: '0.01em',
    },
    label: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1rem',
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
  },

  spacing: {
    0: '0px',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
  },

  borderRadius: {
    none: '0px',
    sm: '0.375rem', // 6px
    md: '0.625rem', // 10px (Medium rounded corners)
    lg: '0.875rem', // 14px
    xl: '1.25rem', // 20px
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
    md: '0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)',
    lg: '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
    aiSoft: '0 0 20px -2px rgba(99, 102, 241, 0.15), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
  },

  motion: {
    durationFast: '150ms',
    durationNormal: '250ms',
    durationSlow: '350ms',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth calm spring ease
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;
