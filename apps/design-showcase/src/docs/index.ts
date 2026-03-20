import { componentDocs } from './components'
import { foundationDocs } from './foundations'
import { patternDocs } from './patterns'
import type { DocEntry, DocGroup, DocSection } from './types'

export type { DocEntry, DocExample, DocGroup, DocProp, DocSection, DocVariant } from './types'

export const docEntries: DocEntry[] = [...foundationDocs, ...componentDocs, ...patternDocs]

export const sectionOrder: DocSection[] = ['foundations', 'components', 'patterns']

export const sectionLabels: Record<DocSection, string> = {
  foundations: 'Foundations',
  components: 'Components',
  patterns: 'Patterns',
}

export const groupLabels: Record<DocGroup, string> = {
  overview: 'Overview',
  color: 'Color',
  typography: 'Typography',
  spacing: 'Spacing',
  backgrounds: 'Backgrounds',
  theming: 'Theming',
  brand: 'Brand',
  primitives: 'Primitives',
  inputs: 'Inputs',
  'data-display': 'Data Display',
  charts: 'Charts',
  feedback: 'Feedback',
  icons: 'Icons',
  surfaces: 'Surfaces',
  navigation: 'Navigation',
  overlays: 'Overlays',
  shells: 'Shells',
  layouts: 'Layouts',
  'page-blocks': 'Page Blocks',
  forms: 'Forms',
}

export const groupOrderBySection: Record<DocSection, DocGroup[]> = {
  foundations: ['overview', 'color', 'typography', 'spacing', 'backgrounds', 'theming', 'brand', 'primitives'],
  components: ['inputs', 'data-display', 'charts', 'feedback', 'icons', 'surfaces', 'navigation', 'overlays'],
  patterns: ['shells', 'layouts', 'page-blocks', 'forms'],
}

export function getEntryPath(entry: DocEntry): string {
  if (entry.section === 'foundations') return `/foundations/${entry.id}`
  if (entry.section === 'components') return `/components/${entry.group}/${entry.id}`
  return `/patterns/${entry.id}`
}

export function findEntry(section: DocSection, id: string, group?: DocGroup) {
  return docEntries.find(
    (entry) => entry.section === section && entry.id === id && (section !== 'components' || entry.group === group)
  )
}

export function getEntriesBySection(section: DocSection) {
  return docEntries.filter((entry) => entry.section === section)
}

export function getGroupsBySection(section: DocSection) {
  return groupOrderBySection[section].filter((group) =>
    docEntries.some((entry) => entry.section === section && entry.group === group)
  )
}

export function getEntryMap() {
  return new Map(docEntries.map((entry) => [entry.id, entry]))
}
