import { createGlobalStyle } from 'styled-components'
import { foundationColors } from '../foundations'
import { renderTokensCss } from './css-contract'

export const IngradientGlobalStyle = createGlobalStyle`
  ${renderTokensCss()}

  html,
  body,
  #root {
    height: 100%;
    margin: 0;
    background:
      radial-gradient(circle at top left, var(--ig-color-bg-radial-a), transparent 32%),
      radial-gradient(circle at top right, var(--ig-color-bg-radial-b), transparent 28%),
      var(--ig-color-bg-canvas);
    color: var(--ig-color-text-primary);
  }

  body {
    font-family: var(--ig-font-sans);
    line-height: 1.4;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  * {
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: var(--ig-scrollbar-thumb) transparent;
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
    background: var(--ig-scrollbar-thumb);
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: var(--ig-scrollbar-thumb-hover);
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:active {
    background: var(--ig-scrollbar-thumb-active);
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
    color: var(--ig-color-text-primary);
  }

  select option {
    background: ${foundationColors.slate900};
    color: var(--ig-color-text-primary);
  }

  a {
    color: inherit;
  }
`
