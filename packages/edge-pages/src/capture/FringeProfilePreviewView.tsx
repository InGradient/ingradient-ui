import { useEffect, useState } from 'react'
import { IconButton, ModalBackdrop, ModalCard, ModalHeader, ModalTitle } from '@ingradient/ui'
import { WindowCloseIcon } from '@ingradient/ui/components'
import { FieldHint } from '@ingradient/ui/patterns'
import { iconSizeNumbers } from '@ingradient/ui/tokens'

import { FringeProfileChartView } from './FringeProfileChartView'

/**
 * 프린지 프로파일 미리보기 — 주기·감마를 고칠 때 화면에 실제로 뜰 줄무늬를 바로 보여준다.
 * 누르면 축 눈금이 붙은 큰 그림으로 확대된다.
 *
 * 표본 계산은 촬영 백엔드와 같은 순서를 따라야 해서 앱이 하고, 여기서는 받은 값을 그린다.
 */
export interface FringeProfilePreviewViewProps {
  /** 표본별 8bit 밝기 (LUT 통과 후). */
  values: number[]
  windowPx: number
  labels: {
    /** 그래프 아래 한 줄 — 구간·최소·최대를 담은 완성된 문장. */
    caption: string
    zoom: string
    /** 확대 화면 제목 — 주기·감마 값이 들어간 완성된 문장. */
    zoomTitle: string
    close: string
  }
}

const PREVIEW_STRIPE_HEIGHT = 26
const PREVIEW_PLOT_HEIGHT = 56
const ZOOM_STRIPE_HEIGHT = 40
const ZOOM_PLOT_HEIGHT = 120

export function FringeProfilePreviewView(props: FringeProfilePreviewViewProps): JSX.Element {
  const { values, windowPx, labels } = props
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    if (!zoomed) return undefined
    const onKey = (e: KeyboardEvent): void => { if (e.key === 'Escape') setZoomed(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoomed])

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={labels.zoom}
        title={labels.zoom}
        style={{ cursor: 'zoom-in' }}
        onClick={() => setZoomed(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setZoomed(true) }}
      >
        <FringeProfileChartView
          values={values}
          windowPx={windowPx}
          stripeHeight={PREVIEW_STRIPE_HEIGHT}
          plotHeight={PREVIEW_PLOT_HEIGHT}
        />
      </div>
      <FieldHint>{labels.caption}</FieldHint>

      {zoomed && (
        <ModalBackdrop onClick={() => setZoomed(false)}>
          <ModalCard
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'min(760px, 92vw)', maxWidth: 'none' }}
          >
            <ModalHeader>
              <ModalTitle>{labels.zoomTitle}</ModalTitle>
              <IconButton aria-label={labels.close} onClick={() => setZoomed(false)}>
                <WindowCloseIcon size={iconSizeNumbers.sm} />
              </IconButton>
            </ModalHeader>
            <FringeProfileChartView
              values={values}
              windowPx={windowPx}
              stripeHeight={ZOOM_STRIPE_HEIGHT}
              plotHeight={ZOOM_PLOT_HEIGHT}
              showAxis
            />
            <FieldHint>{labels.caption}</FieldHint>
          </ModalCard>
        </ModalBackdrop>
      )}
    </div>
  )
}
