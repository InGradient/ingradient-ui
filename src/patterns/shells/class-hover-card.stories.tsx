import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClassHoverCard, useClassHoverCard } from './class-hover-card'

const meta: Meta<typeof ClassHoverCard> = {
  title: 'Patterns/ClassHoverCard',
  component: ClassHoverCard,
}
export default meta

type Story = StoryObj<typeof meta>

const sampleItem = {
  name: 'Crack',
  description: 'Surface crack defect — typically appears along grain boundaries. Length > 2mm flagged as critical.',
  reference_image_url: 'https://placehold.co/280x160/0c101a/e5e7eb?text=Reference+Image',
}

const sampleItemNoImage = {
  name: 'Scratch',
  description: 'Linear surface mark from handling or transport.',
  reference_image_url: null,
}

const sampleItemImageOnly = {
  name: 'Stain',
  description: null,
  reference_image_url: 'https://placehold.co/280x140/0c101a/e5e7eb?text=Stain',
}

export const Default: Story = {
  args: { item: sampleItem, top: 120, left: 80 },
}

export const DescriptionOnly: Story = {
  args: { item: sampleItemNoImage, top: 120, left: 80 },
}

export const ImageOnly: Story = {
  args: { item: sampleItemImageOnly, top: 120, left: 80 },
}

export const Empty: Story = {
  args: { item: null, top: 0, left: 0 },
}

const HOOK_CLASSES = [
  { id: 'c1', name: 'Crack', description: 'Surface crack defect.', reference_image_url: 'https://placehold.co/280x140/0c101a/e5e7eb?text=Crack' },
  { id: 'c2', name: 'Stain', description: null, reference_image_url: 'https://placehold.co/280x140/0c101a/e5e7eb?text=Stain' },
  { id: 'c3', name: 'Scratch', description: 'Linear handling mark.', reference_image_url: null },
  { id: 'c4', name: 'OK', description: null, reference_image_url: null },
]

function HookDemo() {
  const hover = useClassHoverCard(HOOK_CLASSES)
  return (
    <div style={{ padding: 24 }}>
      <p style={{ marginBottom: 12, color: 'var(--ig-color-text-muted)' }}>
        Hover each item — last one (OK) has no content, no card shown.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4, width: 220 }}>
        {HOOK_CLASSES.map((c) => (
          <li
            key={c.id}
            onMouseEnter={(e) => hover.show(c.id, e.currentTarget)}
            onMouseLeave={() => hover.hide(c.id)}
            style={{ padding: '8px 12px', background: 'var(--ig-color-surface-panel)', borderRadius: 6, cursor: 'pointer' }}
          >
            {c.name}
          </li>
        ))}
      </ul>
      <ClassHoverCard
        item={hover.item}
        top={hover.position?.top ?? 0}
        left={hover.position?.left ?? 0}
      />
    </div>
  )
}

export const WithHook: Story = {
  render: () => <HookDemo />,
}
