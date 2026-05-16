import React, { useEffect, useRef, useState } from 'react'

export interface SafeResponsiveContainerProps {
  /** 단일 자식 Recharts root (BarChart / LineChart / PieChart 등). `width` / `height` prop 이 자동 주입됨. */
  children: React.ReactElement
  className?: string
  style?: React.CSSProperties
}

/**
 * Recharts `ResponsiveContainer` 의 안정 대체. ResizeObserver + window resize listener 로
 * 컨테이너 크기 변화를 감지하고 자식에게 `width` / `height` 를 전달.
 *
 * ResponsiveContainer 가 특정 layout 조합 (grid + min-height:0 + transition 등) 에서
 * size 0 을 반복 보고하는 버그를 회피.
 */
export function SafeResponsiveContainer({ children, className, style }: SafeResponsiveContainerProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const element = hostRef.current
    if (!element) return

    const updateSize = () => {
      const nextWidth = Math.max(0, element.clientWidth)
      const nextHeight = Math.max(0, element.clientHeight)
      setSize((prev) =>
        prev.width === nextWidth && prev.height === nextHeight
          ? prev
          : { width: nextWidth, height: nextHeight },
      )
    }

    updateSize()

    const observer = new ResizeObserver(() => updateSize())
    observer.observe(element)
    window.addEventListener('resize', updateSize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  const mergedStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    minWidth: 0,
    minHeight: 0,
    ...style,
  }

  return (
    <div ref={hostRef} className={className} style={mergedStyle}>
      {size.width > 0 && size.height > 0
        ? React.cloneElement(children, { width: size.width, height: size.height })
        : null}
    </div>
  )
}
