import React from 'react'
import { useElementSize } from '../../hooks/useElementSize'

export function ChartResponsive({
  height,
  minWidth = 240,
  children,
}: {
  height: number
  minWidth?: number
  children: (size: { width: number; height: number }) => React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const { width } = useElementSize(ref, { minWidth })

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        minWidth,
        minHeight: height,
      }}
    >
      {width > 0 ? children({ width, height }) : null}
    </div>
  )
}
