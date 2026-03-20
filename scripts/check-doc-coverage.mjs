import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')

const showcaseDocFiles = [
  path.join(repoRoot, 'apps/design-showcase/src/docs/foundations.tsx'),
  path.join(repoRoot, 'apps/design-showcase/src/docs/components.tsx'),
  path.join(repoRoot, 'apps/design-showcase/src/docs/patterns.tsx'),
]

const requiredDocIds = [
  'overview',
  'colors',
  'typography',
  'spacing',
  'backgrounds',
  'theming',
  'brand',
  'layout-primitives',
  'type-primitives',
  'surface-primitives',
  'button',
  'text-field',
  'select',
  'checkbox-switch',
  'avatar-badge',
  'data-grid',
  'image-grid',
  'charts',
  'progress',
  'workspace-blocks',
  'alert',
  'empty-loading',
  'card',
  'accordion',
  'navigation',
  'icon-gallery',
  'dialog',
  'overlay-blocks',
  'drawer',
  'tooltip',
  'app-shell',
  'sidebar-shell',
  'toolbar',
  'split-layout',
  'form-section',
  'dashboard-grid',
  'list-detail',
  'settings-shell',
]

const requiredReferenceFiles = [
  'docs/reference/getting-started.md',
  'docs/reference/foundations.md',
  'docs/reference/troubleshooting.md',
  'docs/reference/coverage-matrix.md',
  'docs/reference/components/button.md',
  'docs/reference/components/text-field.md',
  'docs/reference/components/select.md',
  'docs/reference/components/checkbox-switch.md',
  'docs/reference/components/avatar-badge.md',
  'docs/reference/components/navigation.md',
  'docs/reference/components/tabs.md',
  'docs/reference/components/table.md',
  'docs/reference/components/image-grid.md',
  'docs/reference/components/charts.md',
  'docs/reference/components/feedback.md',
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

const showcaseIds = new Set()

for (const file of showcaseDocFiles) {
  const text = fs.readFileSync(file, 'utf8')
  for (const match of text.matchAll(/id:\s*'([^']+)'/g)) {
    showcaseIds.add(match[1])
  }
}

const missingDocIds = requiredDocIds.filter((id) => !showcaseIds.has(id))
const missingReferenceFiles = requiredReferenceFiles.filter((relativePath) => !fs.existsSync(path.join(repoRoot, relativePath)))

if (missingDocIds.length > 0 || missingReferenceFiles.length > 0) {
  if (missingDocIds.length > 0) {
    console.error('Missing showcase doc ids:')
    for (const id of missingDocIds) console.error(`- ${id}`)
  }
  if (missingReferenceFiles.length > 0) {
    console.error('Missing reference files:')
    for (const file of missingReferenceFiles) console.error(`- ${file}`)
  }
  process.exit(1)
}

console.log('Showcase docs and markdown reference coverage checks passed.')
