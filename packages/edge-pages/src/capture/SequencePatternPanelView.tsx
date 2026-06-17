import { useEffect, useMemo } from 'react'
import { isDerivedPattern, patternLabelToUI, sortOriginalPatterns, sortDerivedPatterns, patternLabelToHintKey } from './pattern-helpers'
import {
  Container, Segment, SegmentBtn, List, Item, Empty,
} from './SequencePatternPanelView.styles'
import type { SequencePatternPanelViewProps } from './types'

export function SequencePatternPanelView(props: SequencePatternPanelViewProps): JSX.Element {
  const {
    images, activeImageId, viewMode, enabledFeatures, labels,
    tuningControls, onSelectImage, onSetViewMode,
  } = props

  const filtered = useMemo(() => {
    const pool = images.filter((img) => {
      const isDerived = isDerivedPattern(img.patternLabel)
      if (viewMode === 'derived' ? !isDerived : isDerived) return false
      if (viewMode === 'derived' && img.patternLabel) {
        return enabledFeatures[img.patternLabel] !== false
      }
      return true
    })
    return viewMode === 'derived' ? sortDerivedPatterns(pool) : sortOriginalPatterns(pool)
  }, [images, viewMode, enabledFeatures])

  useEffect(() => {
    if (!activeImageId) return
    const active = filtered.find((img) => img.imageId === activeImageId)
    if (active) return
    const fallback = filtered[0]?.imageId ?? null
    if (fallback) onSelectImage(fallback)
  }, [activeImageId, filtered, onSelectImage])

  return (
    <Container>
      <Segment>
        <SegmentBtn $active={viewMode === 'originals'} onClick={() => onSetViewMode('originals')}>
          {labels.originals}
        </SegmentBtn>
        <SegmentBtn $active={viewMode === 'derived'} onClick={() => onSetViewMode('derived')}>
          {labels.derived}
        </SegmentBtn>
      </Segment>
      <List>
        {filtered.length === 0 ? (
          <Empty>
            {viewMode === 'derived' ? labels.noDerived : labels.noOriginals}
          </Empty>
        ) : (
          filtered.map((img) => {
            const hintKey = patternLabelToHintKey(img.patternLabel)
            const hint = hintKey ? labels.patternHint[hintKey] : undefined
            return (
              <Item
                key={img.imageId}
                $active={img.imageId === activeImageId}
                onClick={() => onSelectImage(img.imageId)}
                title={hint}
              >
                {patternLabelToUI(img.patternLabel ?? '')}
              </Item>
            )
          })
        )}
      </List>
      {viewMode === 'derived' && tuningControls}
    </Container>
  )
}
