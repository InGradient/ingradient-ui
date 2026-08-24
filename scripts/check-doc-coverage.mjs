import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')

/**
 * Storybook seed files — the structural entry points that define the
 * documentation tree. Individual component/pattern stories are discovered
 * by Storybook itself; this list only verifies the foundational seeds.
 *
 * Updated 2026-08-24 to reflect story consolidation:
 * - Former flat pattern stories (form-sections, dashboard-grid, shell-and-layouts,
 *   overlay-blocks, workspace-blocks) were consolidated into their respective
 *   component/pattern directories or platform page story groups.
 * - Former generic page stories (table-page, settings-workspace-page,
 *   workspace-api-page) were consolidated into stories/pages/platform/0.0.1/.
 * - surfaces.stories.tsx moved to src/primitives/surfaces/.
 * - drawing-layer, image-grid, comment-thread, charts moved from
 *   src/components/ to src/patterns/.
 * - settings-dialog.stories.tsx was consolidated into SettingsModal platform stories.
 */
const requiredStoryFiles = [
  '.storybook/main.ts',
  '.storybook/preview.tsx',
  'stories/guides/getting-started.stories.tsx',
  'stories/foundations/token-overview.stories.tsx',
  'stories/sandboxes/interaction-utils-lab.stories.tsx',
  'stories/sandboxes/state-matrix.stories.tsx',
  'stories/sandboxes/theme-lab.stories.tsx',
  'stories/sandboxes/hooks-lab.stories.tsx',
  // Pattern-level seeds (consolidated from former flat pattern stories)
  'src/patterns/forms/checkbox-group.stories.tsx',
  'src/patterns/layouts/layouts.stories.tsx',
  'src/patterns/charts/charts.stories.tsx',
  'src/patterns/gallery/image-grid.stories.tsx',
  'src/patterns/annotation/drawing-layer.stories.tsx',
  'src/patterns/comment/comment-thread.stories.tsx',
  'stories/patterns/sidebar-shell.stories.tsx',
  // Platform page seeds (consolidated from former generic page stories)
  'stories/pages/platform/0.0.1/Catalog.stories.tsx',
  'stories/pages/platform/0.0.1/SettingsModal.stories.tsx',
  'stories/pages/platform/0.0.1/Dashboard.stories.tsx',
  'stories/pages/platform/0.0.1/ClassManage.stories.tsx',
  'stories/pages/platform/0.0.1/CreateProject.stories.tsx',
  'stories/pages/platform/0.0.1/auth/Login.stories.tsx',
  // Component seeds
  'src/components/inputs/button.stories.tsx',
  'src/components/inputs/file-input.stories.tsx',
  'src/components/inputs/text-fields.stories.tsx',
  'src/components/inputs/search-field.stories.tsx',
  'src/components/inputs/number-field.stories.tsx',
  'src/components/inputs/date-picker.stories.tsx',
  'src/components/inputs/mention-textarea.stories.tsx',
  'src/components/inputs/select-field.stories.tsx',
  'src/components/inputs/toggles.stories.tsx',
  'src/components/inputs/upload-dropzone.stories.tsx',
  'src/components/feedback/alert.stories.tsx',
  'src/components/feedback/avatar-badge.stories.tsx',
  'src/components/feedback/empty-state.stories.tsx',
  'src/components/feedback/notification-badge.stories.tsx',
  'src/components/feedback/progress.stories.tsx',
  'src/components/feedback/selection-action-bar.stories.tsx',
  'src/components/feedback/spinner.stories.tsx',
  'src/components/feedback/toast.stories.tsx',
  'src/components/navigation/navigation-family.stories.tsx',
  'src/components/navigation/tabs.stories.tsx',
  'src/components/navigation/vertical-tabs.stories.tsx',
  'src/components/overlays/dialog-shell.stories.tsx',
  'src/components/overlays/drawer.stories.tsx',
  'src/components/overlays/tooltip.stories.tsx',
  'src/components/overlays/context-menu.stories.tsx',
  'src/primitives/surfaces/surfaces.stories.tsx',
  'src/components/data-display/table.stories.tsx',
  'src/components/data-display/tag-list.stories.tsx',
  'src/components/data-display/image-viewer.stories.tsx',
  'src/components/icons/icon-gallery.stories.tsx',
]

const requiredReferenceFiles = [
  'docs-legacy/reference/getting-started.md',
  'docs-legacy/reference/foundations.md',
  'docs-legacy/reference/troubleshooting.md',
  'docs-legacy/reference/coverage-matrix.md',
  'docs-legacy/reference/components/button.md',
  'docs-legacy/reference/components/file-input.md',
  'docs-legacy/reference/components/text-field.md',
  'docs-legacy/reference/components/select.md',
  'docs-legacy/reference/components/checkbox-switch.md',
  'docs-legacy/reference/components/avatar-badge.md',
  'docs-legacy/reference/components/notification-badge.md',
  'docs-legacy/reference/components/navigation.md',
  'docs-legacy/reference/components/vertical-tabs.md',
  'docs-legacy/reference/components/tabs.md',
  'docs-legacy/reference/components/table.md',
  'docs-legacy/reference/components/image-grid.md',
  'docs-legacy/reference/components/charts.md',
  'docs-legacy/reference/components/feedback.md',
  'docs-legacy/reference/components/toast.md',
  'docs-legacy/reference/components/progress.md',
  'docs-legacy/reference/components/alert.md',
  'docs-legacy/reference/components/empty-loading.md',
  'docs-legacy/reference/components/icons.md',
  'docs-legacy/reference/components/surfaces.md',
  'docs-legacy/reference/components/overlays.md',
  'docs-legacy/reference/components/drawer.md',
  'docs-legacy/reference/components/tooltip.md',
  'docs-legacy/reference/components/menus-and-overlays.md',
  'docs-legacy/reference/components/workspace-blocks.md',
  'docs-legacy/reference/components/dialog-shell.md',
  'docs-legacy/reference/patterns/app-shell.md',
  'docs-legacy/reference/patterns/sidebar-shell.md',
  'docs-legacy/reference/patterns/toolbar.md',
  'docs-legacy/reference/patterns/layouts.md',
  'docs-legacy/reference/patterns/split-layout.md',
  'docs-legacy/reference/patterns/settings-shell.md',
  'docs-legacy/reference/patterns/dashboard-grid.md',
  'docs-legacy/reference/patterns/list-detail.md',
  'docs-legacy/reference/patterns/forms.md',
  'docs-legacy/reference/patterns/form-section.md',
  'docs-legacy/reference/recipes/auth-page.md',
  'docs-legacy/reference/recipes/table-page.md',
  'docs-legacy/reference/recipes/settings-page.md',
  'docs-legacy/reference/recipes/gallery-like-browser.md',
]

const missingStoryFiles = requiredStoryFiles.filter((relativePath) => !fs.existsSync(path.join(repoRoot, relativePath)))
const missingReferenceFiles = requiredReferenceFiles.filter((relativePath) => !fs.existsSync(path.join(repoRoot, relativePath)))

if (missingStoryFiles.length > 0 || missingReferenceFiles.length > 0) {
  if (missingStoryFiles.length > 0) {
    console.error('Missing Storybook seed files:')
    for (const file of missingStoryFiles) console.error(`- ${file}`)
  }
  if (missingReferenceFiles.length > 0) {
    console.error('Missing reference files:')
    for (const file of missingReferenceFiles) console.error(`- ${file}`)
  }
  process.exit(1)
}

console.log('Storybook seed and legacy markdown reference coverage checks passed.')