// Run-specific equivalent of /tmp/edge-bounded-vitest.config.mjs.
// Vitest's browser pool reads project.config.maxWorkers, not the root CLI limit.
import config from '/Users/homebodify/Projects/ingradient-ui/.letta/worktrees/edge-verification-contracts/vitest.config.ts'
export default {
  ...config,
  root: '/Users/homebodify/Projects/ingradient-ui/.letta/worktrees/edge-verification-contracts',
  test: { ...config.test, maxWorkers: 2, projects: config.test.projects.map(project => ({ ...project, test: { ...project.test, maxWorkers: 2 } })) },
}
