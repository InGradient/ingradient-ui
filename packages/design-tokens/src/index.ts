import { createGlobalStyle } from 'styled-components'

export const PortalGlobalStyle = createGlobalStyle`
  :root {
    --portal-bg-base: #0f1115;
    --portal-bg-radial-a: rgba(66, 139, 202, 0.18);
    --portal-bg-radial-b: rgba(0, 158, 115, 0.12);
    --portal-surface-header: rgba(12, 15, 20, 0.88);
    --portal-surface-panel: rgba(12, 15, 20, 0.8);
    --portal-surface-elevated: #10151d;
    --portal-surface-muted: rgba(13, 18, 27, 0.92);
    --portal-surface-interactive: rgba(255, 255, 255, 0.04);
    --portal-surface-active: rgba(77, 136, 255, 0.16);
    --portal-border: rgba(255, 255, 255, 0.08);
    --portal-border-strong: rgba(148, 163, 184, 0.18);
    --portal-text-primary: #edf2f7;
    --portal-text-secondary: #d7deea;
    --portal-text-muted: #98a2b3;
    --portal-text-soft: #708196;
    --portal-accent: #4d88ff;
    --portal-accent-strong: #2962d9;
    --portal-accent-soft: #8cb6ff;
    --portal-success: #35c6a7;
    --portal-warning: #ffd179;
    --portal-danger: #ff9a9a;
    --portal-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    --portal-scrollbar-thumb: rgba(148, 163, 184, 0.22);
    --portal-scrollbar-thumb-hover: rgba(148, 163, 184, 0.34);
    --portal-scrollbar-thumb-active: rgba(148, 163, 184, 0.42);
  }

  html,
  body,
  #root {
    height: 100%;
    margin: 0;
    background:
      radial-gradient(circle at top left, var(--portal-bg-radial-a), transparent 32%),
      radial-gradient(circle at top right, var(--portal-bg-radial-b), transparent 28%),
      var(--portal-bg-base);
    color: var(--portal-text-primary);
  }

  body {
    font-family:
      "IBM Plex Sans",
      "Segoe UI",
      sans-serif;
    line-height: 1.4;
  }

  * {
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: var(--portal-scrollbar-thumb) transparent;
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 999px;
    background: var(--portal-scrollbar-thumb);
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: var(--portal-scrollbar-thumb-hover);
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:active {
    background: var(--portal-scrollbar-thumb-active);
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-corner {
    background: transparent;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  input:not([type='checkbox']):not([type='radio']),
  select,
  textarea {
    color: var(--portal-text-primary);
  }

  select option {
    background: #111821;
    color: var(--portal-text-primary);
  }

  a {
    color: inherit;
  }
`

export const DesignSystemGlobalStyle = PortalGlobalStyle
