/**
 * Storybook page-level controls — § 15.3.
 *
 * Page story 가 자주 필요로 하는 control 정의를 표준 이름으로 통일.
 * 각 page 가 해당 control 을 사용하는지는 page 책임.
 */

import type { InputType } from 'storybook/internal/types'

export type ViewMode = 'table' | 'grid'
export type SidebarState = 'expanded' | 'compact' | 'hidden'
export type RightPanelState = 'open' | 'closed'
export type FilterStyle = 'chips' | 'dropdown' | 'side-panel'
export type TableDensity = 'comfortable' | 'compact' | 'dense'
export type SelectionMode = 'single' | 'multi'

const cat = (name: string): NonNullable<InputType['table']> => ({ category: 'Page', subcategory: name })

export const viewModeArg: InputType = {
  name: 'View mode',
  control: 'inline-radio',
  options: ['table', 'grid'] satisfies ViewMode[],
  table: cat('Layout'),
}

export const sidebarArg: InputType = {
  name: 'Sidebar',
  control: 'select',
  options: ['expanded', 'compact', 'hidden'] satisfies SidebarState[],
  table: cat('Layout'),
}

export const rightPanelArg: InputType = {
  name: 'Right panel',
  control: 'inline-radio',
  options: ['open', 'closed'] satisfies RightPanelState[],
  table: cat('Layout'),
}

export const filterStyleArg: InputType = {
  name: 'Filter style',
  control: 'select',
  options: ['chips', 'dropdown', 'side-panel'] satisfies FilterStyle[],
  table: cat('Filter'),
}

export const tableDensityArg: InputType = {
  name: 'Table density',
  control: 'select',
  options: ['comfortable', 'compact', 'dense'] satisfies TableDensity[],
  table: cat('Layout'),
}

export const selectionModeArg: InputType = {
  name: 'Selection mode',
  control: 'inline-radio',
  options: ['single', 'multi'] satisfies SelectionMode[],
  table: cat('Selection'),
}
