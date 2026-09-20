// 촬영 화면 위에 얹히는 것들 — 파생 뷰 계산 오버레이와 프린지 프로파일.
// 실제 앱에서는 이미지 영역 위(오버레이)와 Setup 패널 안(프로파일)에 들어간다.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '@ingradient/ui'

import { DerivedCalculateOverlayView, type DerivedCalcState } from './DerivedCalculateOverlayView'
import { FringeProfilePreviewView } from './FringeProfilePreviewView'

const OVERLAY_LABELS = { calculate: 'Calculate', calculating: '계산 중' }

/** 백엔드 patterns.py 와 같은 순서: stripe → uint8 → LUT(감마·밝기범위). */
function fringeValues(period: number, gamma = 2.2, min = 16, max = 255): number[] {
  const span = Math.max(1, max - min)
  const windowPx = Math.max(256, period * 2)
  return Array.from({ length: 256 }, (_, i) => {
    const x = (i / 255) * windowPx
    const stripe = 0.5 * (1 + Math.sin((2 * Math.PI * x) / period))
    const corrected = Math.pow(stripe, 1 / Math.max(0.01, gamma))
    return Math.min(255, Math.max(0, Math.round(min + corrected * span)))
  })
}

function OverlayOnImage({ state, reason }: { state: DerivedCalcState; reason?: string }): JSX.Element {
  return (
    <div style={{
      position: 'relative', height: 280,
      display: 'grid', placeItems: 'center',
      background: 'var(--ig-color-surface-sunken)', color: 'var(--ig-color-text-muted)',
    }}>
      촬영 이미지 자리
      <DerivedCalculateOverlayView
        state={state}
        reason={reason}
        labels={OVERLAY_LABELS}
        onCalculate={() => undefined}
      />
    </div>
  )
}

const meta: Meta<typeof OverlayOnImage> = {
  title: 'Edge Pages/Capture/Overlays',
  component: OverlayOnImage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof OverlayOnImage>

/** 아직 계산하지 않은 파생 뷰 — 누르면 그 자리에서 계산한다. */
export const CalculateIdle: Story = { args: { state: 'idle' } }

export const Calculating: Story = { args: { state: 'running' } }

/** 왜 못 누르는지를 남긴다 — 없으면 고장으로 보인다. */
export const Unavailable: Story = {
  args: { state: 'unavailable', reason: '이 촬영에는 X 축 프레임이 없다' },
}

/** 주기·감마를 고칠 때 실제로 뜰 줄무늬. 그림을 누르면 축이 붙은 큰 그림으로 확대된다. */
export const FringeProfile: StoryObj<typeof FringeProfilePreviewView> = {
  render: () => (
    <Stack gap="var(--ig-space-6)" style={{ padding: 'var(--ig-space-6)', maxWidth: 360 }}>
      <FringeProfilePreviewView
        values={fringeValues(24)}
        windowPx={256}
        labels={{
          caption: '256px 구간 · 밝기 16–255',
          zoom: '크게 보기',
          zoomTitle: '프린지 미리보기 — 주기 24 · 감마 2.2',
          close: '닫기',
        }}
      />
      <FringeProfilePreviewView
        values={fringeValues(96)}
        windowPx={256}
        labels={{
          caption: '256px 구간 · 주기를 굵게 하면 한 주기가 화면을 크게 차지한다',
          zoom: '크게 보기',
          zoomTitle: '프린지 미리보기 — 주기 96 · 감마 2.2',
          close: '닫기',
        }}
      />
    </Stack>
  ),
}
