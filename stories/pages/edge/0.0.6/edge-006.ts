// Edge 0.0.6 story helpers. 0.0.6 reorganizes the Edge stories (one group per page, all
// workflows under Workflows) and reuses the 0.0.5 scenes and fixtures instead of copying them.
import { defineHandoff } from '../../../support/handoff'

interface Edge006Handoff {
  page: string
  referenceStory: string
  fixturesPath: string
  requiredScenarios: string[]
  interactions: string[]
}

/** Full-window page parameters shared by every 0.0.6 story file; accessibility is blocking. */
export function edge006Parameters(handoff: Edge006Handoff) {
  return {
    layout: 'fullscreen' as const,
    a11y: { test: 'error' as const },
    ...defineHandoff({
      service: 'edge',
      version: '0.0.6',
      preset: 'edge-0.0.1',
      platformIntegration: ['Same View contracts as 0.0.5; see stories/pages/edge/0.0.5/README.md'],
      ...handoff,
    }),
  }
}

/** Dialog stories cover the whole Docs page, so they open from the sidebar only. */
export const DIALOG_ONLY = { tags: ['!autodocs'] }
