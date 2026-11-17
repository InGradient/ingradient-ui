// Story-only harness elements: results of mock actions and values that play functions assert.
// They are not part of the product screen, so they stay in the DOM (tests, screen readers) but are
// never drawn. Use these instead of raw <p role="status"> / <output> in page stories.
import type { CSSProperties, ReactNode } from 'react'

export const STORY_HIDDEN: CSSProperties = {
  position: 'absolute',
  width: 'var(--ig-space-1px)',
  height: 'var(--ig-space-1px)',
  padding: 0,
  margin: 'var(--ig-space-neg-1px)',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

/** Mock-action result sentence (announced politely, not drawn). */
export function StoryStatus({ children }: { children: ReactNode }): JSX.Element {
  return <div role="status" data-story-harness="status" style={STORY_HIDDEN}>{children}</div>
}

/** Named value a play function reads (e.g. "Label count"). */
export function StoryProbe({ label, children }: { label: string; children: ReactNode }): JSX.Element {
  return <output aria-label={label} data-story-harness="probe" style={STORY_HIDDEN}>{children}</output>
}

/** Buttons that drive simulated async outcomes for play functions (complete / fail / switch scene). */
export function StoryControls({ children }: { children: ReactNode }): JSX.Element {
  return <div data-story-harness="controls" style={STORY_HIDDEN}>{children}</div>
}
