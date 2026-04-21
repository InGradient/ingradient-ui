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
  'docs/reference/getting-started.md',
  'docs/reference/foundations.md',
  'docs/reference/troubleshooting.md',
  'docs/reference/coverage-matrix.md',
  'docs/reference/components/button.md',
  'docs/reference/components/file-input.md',
  'docs/reference/components/text-field.md',
  'docs/reference/components/select.md',
  'docs/reference/components/checkbox-switch.md',
  'docs/reference/components/avatar-badge.md',
  'docs/reference/components/notification-badge.md',
  'docs/reference/components/navigation.md',
  'docs/reference/components/vertical-tabs.md',
  'docs/reference/components/tabs.md',
  'docs/reference/components/table.md',
  'docs/reference/components/image-grid.md',
  'docs/reference/components/charts.md',
  'docs/reference/components/feedback.md',
  'docs/reference/components/toast.md',
  'docs/reference/components/progress.md',
  'docs/reference/components/alert.md',
  'docs/reference/components/empty-loading.md',
  'docs/reference/components/icons.md',
  'docs/reference/components/surfaces.md',
  'docs/reference/components/overlays.md',
  'docs/reference/components/drawer.md',
  'docs/reference/components/tooltip.md',
  'docs/reference/components/menus-and-overlays.md',
  'docs/reference/components/workspace-blocks.md',
  'docs/reference/components/dialog-shell.md',
  'docs/reference/patterns/app-shell.md',
  'docs/reference/patterns/sidebar-shell.md',
  'docs/reference/patterns/toolbar.md',
  'docs/reference/patterns/layouts.md',
  'docs/reference/patterns/split-layout.md',
  'docs/reference/patterns/settings-shell.md',
  'docs/reference/patterns/dashboard-grid.md',
  'docs/reference/patterns/list-detail.md',
  'docs/reference/patterns/forms.md',
  'docs/reference/patterns/form-section.md',
  'docs/reference/recipes/auth-page.md',
  'docs/reference/recipes/table-page.md',
  'docs/reference/recipes/settings-page.md',
  'docs/reference/recipes/gallery-like-browser.md',
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

console.log('Storybook seed and markdown reference coverage checks passed.')
