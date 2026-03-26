import type React from 'react'

export type DocSection = 'foundations' | 'components' | 'patterns'

export type DocGroup =
  | 'overview'
  | 'color'
  | 'typography'
  | 'spacing'
  | 'backgrounds'
  | 'theming'
  | 'brand'
  | 'primitives'
  | 'hooks'
  | 'inputs'
  | 'data-display'
  | 'charts'
  | 'feedback'
  | 'icons'
  | 'surfaces'
  | 'navigation'
  | 'overlays'
  | 'shells'
  | 'layouts'
  | 'page-blocks'
  | 'forms'

export interface DocProp {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description: string
}

export interface DocVariant {
  name: string
  values: string[]
  description: string
}

export interface DocExample {
  title: string
  description?: string
  component: React.ComponentType
}

export interface DocEntry {
  id: string
  section: DocSection
  group?: DocGroup
  title: string
  summary: string
  whenToUse: string
  whenNotToUse?: string
  chooseThisWhen?: string[]
  useInsteadWhen?: string[]
  importPath: string
  examples: DocExample[]
  states: string[]
  props: DocProp[]
  variants: DocVariant[]
  related: string[]
  commonComposition?: string[]
  commonMistakes?: string[]
  notes: string[]
  dos: string[]
  donts: string[]
  status: 'ready' | 'draft'
}
