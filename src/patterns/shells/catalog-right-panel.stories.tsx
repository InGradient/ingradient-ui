import type { Meta, StoryObj } from '@storybook/react-vite'
import { CatalogRightPanel } from './catalog-right-panel'
import { SwatchItemList } from '../../components/data-display/swatch-item-list'
import { MemberPoolList } from './member-pool-list'
import { TagListSearch } from '../../components/data-display/tag-list-panel'

const CLASSES = [
  { id: 'c1', name: 'Crack', color: '#ff6b6b', count: 412 },
  { id: 'c2', name: 'Scratch', color: '#feca57', count: 318 },
  { id: 'c3', name: 'Dent', color: '#48dbfb', count: 247 },
]
const ALL_CLASSES = [
  ...CLASSES,
  { id: 'c4', name: 'Discoloration', color: '#1dd1a1' },
  { id: 'c5', name: 'Stain', color: '#a55eea' },
  { id: 'c6', name: 'Rust', color: '#ee5a6f' },
]
const MEMBERS = [
  { id: 'm1', name: 'June Lee', role: 'Owner' },
  { id: 'm2', name: 'Soyeon Park', role: 'Maintainer' },
]

const meta: Meta<typeof CatalogRightPanel> = {
  title: 'Patterns/CatalogRightPanel',
  component: CatalogRightPanel,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 320, height: '100vh', borderLeft: '1px solid var(--ig-color-border-subtle)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const candidates = ALL_CLASSES.filter((c) => !CLASSES.find((connected) => connected.id === c.id)).map((c) => ({ id: c.id, color: c.color, label: c.name }))

export const Default: Story = {
  args: {
    sections: [
      {
        title: 'Class',
        body: <>
          <TagListSearch placeholder="Search class to add" candidates={candidates} onSelect={() => undefined} emptyMessage="No more classes." />
          <SwatchItemList items={CLASSES.map((c) => ({ id: c.id, label: c.name, color: c.color, count: c.count }))} onRemove={() => undefined} />
        </>,
      },
      {
        title: 'Members',
        body: <>
          <TagListSearch placeholder="Search member to add" candidates={[]} onSelect={() => undefined} emptyMessage="No more members." />
          <MemberPoolList members={MEMBERS} onRemove={() => undefined} />
        </>,
      },
    ],
  },
}

export const EmptyClasses: Story = {
  args: {
    sections: [
      {
        title: 'Class',
        body: <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-sm)' }}>No classes connected.</span>,
      },
      {
        title: 'Members',
        body: <MemberPoolList members={MEMBERS} onRemove={() => undefined} />,
      },
    ],
  },
}
