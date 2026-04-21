import React from 'react'

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
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      const nextWidth = Math.max(element.clientWidth, minWidth)
      if (nextWidth > 0) {
        setWidth((current) => (current === nextWidth ? current : nextWidth))
      }
    }

    update()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => update())
      observer.observe(element)
      return () => observer.disconnect()
    }

    const timer = window.setInterval(update, 160)
    return () => window.clearInterval(timer)
  }, [minWidth])

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
