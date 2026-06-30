import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ConfirmProvider, useConfirm } from './use-confirm'
import { Button } from '../inputs/button'
import { StorybookCard, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Overlays/ConfirmProvider',
  component: ConfirmProvider,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ConfirmProvider>

export default meta
type Story = StoryObj<typeof meta>

const RESULT_STYLE = { color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-sm)' } as const
const ROW_STYLE = { display: 'flex', alignItems: 'center', gap: 'var(--ig-space-4)' } as const

function ConfirmDemo() {
  const confirm = useConfirm()
  const [result, setResult] = useState('—')
  return (
    <div style={ROW_STYLE}>
      <Button
        variant="secondary"
        onClick={async () => {
          const ok = await confirm({
            title: 'Delete dataset?',
            description: '이 작업은 되돌릴 수 없습니다. 데이터셋과 연결된 라벨이 모두 삭제됩니다.',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
            danger: true,
          })
          setResult(ok ? 'confirmed' : 'cancelled')
        }}
      >
        Delete…
      </Button>
      <span style={RESULT_STYLE}>last result: {result}</span>
    </div>
  )
}

export const Review: Story = {
  args: { children: null },
  render: () => (
    <StorybookPage
      title="ConfirmProvider / useConfirm"
      description="Promise 기반 확인 다이얼로그를 context 로 제공. 앱 루트를 ConfirmProvider 로 감싸면 어디서든 useConfirm() 으로 `await confirm({ title, description, danger })` 호출 → 사용자가 확인/취소하면 boolean resolve. danger 옵션으로 위험 액션 강조."
    >
      <StorybookSection title="확인 흐름" description="버튼 클릭 → 확인 다이얼로그(danger) → 결과 resolve.">
        <StorybookCard title="useConfirm()" subtitle="ConfirmProvider 안에서 호출">
          <ConfirmProvider>
            <ConfirmDemo />
          </ConfirmProvider>
        </StorybookCard>
      </StorybookSection>
    </StorybookPage>
  ),
}
