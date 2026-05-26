import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')

const requiredStoryFiles = [
  '.storybook/main.ts',
  '.storybook/preview.tsx',
  'stories/guides/getting-started.stories.tsx',
  'stories/foundations/token-overview.stories.tsx',
  'stories/sandboxes/interaction-utils-lab.stories.tsx',
  'stories/sandboxes/state-matrix.stories.tsx',
  'stories/sandboxes/theme-lab.stories.tsx',
  'stories/sandboxes/hooks-lab.stories.tsx',
  'stories/patterns/form-sections.stories.tsx',
  'stories/patterns/dashboard-grid.stories.tsx',
  'stories/patterns/shell-and-layouts.stories.tsx',
  'stories/patterns/overlay-blocks.stories.tsx',
  'stories/patterns/workspace-blocks.stories.tsx',
  'stories/pages/table-page.stories.tsx',
  'stories/pages/settings-workspace-page.stories.tsx',
  'stories/pages/workspace-api-page.stories.tsx',
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
  'src/components/overlays/settings-dialog.stories.tsx',
  'src/components/overlays/drawer.stories.tsx',
  'src/components/overlays/tooltip.stories.tsx',
  'src/components/overlays/context-menu.stories.tsx',
  'src/components/surfaces.stories.tsx',
  'src/components/data-display/table.stories.tsx',
  'src/components/data-display/tag-list.stories.tsx',
  'src/components/data-display/drawing-layer.stories.tsx',
  'src/components/data-display/image-grid.stories.tsx',
  'src/components/data-display/image-viewer.stories.tsx',
  'src/components/data-display/comment-thread.stories.tsx',
  'src/components/charts/charts.stories.tsx',
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
