import React from 'react'

type LayerId = 'foundations' | 'components' | 'patterns' | 'pages' | 'unknown'

type ComponentEntry = {
  name: string
  layer: LayerId
}

type ComponentMarker = {
  componentEntries: ComponentEntry[]
  componentChain: string[]
  slotChain: string[]
  element: HTMLElement | null
  rect: DOMRect | null
  summary: string
  componentName: string | null
  slotName: string | null
  groupedLayers: Record<LayerId, string[]>
}

const LAYER_ORDER: LayerId[] = ['foundations', 'components', 'patterns', 'pages']

const LAYER_LABELS: Record<LayerId, string> = {
  foundations: 'Foundations',
  components: 'Components',
  patterns: 'Patterns',
  pages: 'Pages',
  unknown: 'Unknown',
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim()
}

function truncateText(value: string, max = 72): string {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1)}…`
}

function findInteractiveElement(target: EventTarget | null, boundary: HTMLElement | null): HTMLElement | null {
  let node = target instanceof HTMLElement ? target : null

  while (node) {
    const tagName = node.tagName.toLowerCase()
    const role = node.getAttribute('role')
    if (
      tagName === 'button'
      || tagName === 'a'
      || tagName === 'input'
      || tagName === 'select'
      || tagName === 'textarea'
      || role === 'button'
      || role === 'link'
      || role === 'tab'
      || role === 'switch'
      || role === 'checkbox'
      || role === 'radio'
    ) {
      return node
    }
    if (node === boundary) break
    node = node.parentElement
  }

  return null
}

function readAttrChain(
  target: HTMLElement | null,
  boundary: HTMLElement | null,
  attr: 'igComponent' | 'igSlot',
): string[] {
  const names: string[] = []
  let node = target

  while (node) {
    const value = node.dataset[attr]?.trim()
    if (value) names.push(value)
    if (node === boundary) break
    node = node.parentElement
  }

  return names
}

function readLayer(value: string | undefined): LayerId {
  if (value === 'foundations' || value === 'components' || value === 'patterns' || value === 'pages') {
    return value
  }
  return 'unknown'
}

function readComponentEntries(target: HTMLElement | null, boundary: HTMLElement | null): ComponentEntry[] {
  const entries: ComponentEntry[] = []
  let node = target

  while (node) {
    const name = node.dataset.igComponent?.trim()
    if (name) {
      entries.push({
        name,
        layer: readLayer(node.dataset.igLayer),
      })
    }
    if (node === boundary) break
    node = node.parentElement
  }

  return entries
}

function groupEntriesByLayer(entries: ComponentEntry[]): Record<LayerId, string[]> {
  const grouped: Record<LayerId, string[]> = {
    foundations: [],
    components: [],
    patterns: [],
    pages: [],
    unknown: [],
  }

  for (const entry of entries) {
    if (!grouped[entry.layer].includes(entry.name)) grouped[entry.layer].push(entry.name)
  }

  return grouped
}

function findElementByAttr(
  target: HTMLElement | null,
  boundary: HTMLElement | null,
  attr: 'igComponent' | 'igSlot',
): HTMLElement | null {
  let node = target

  while (node) {
    if (node.dataset[attr]?.trim()) return node
    if (node === boundary) break
    node = node.parentElement
  }

  return boundary?.dataset[attr] ? boundary : null
}

function readElementSummary(target: HTMLElement | null): string {
  if (!target) return 'No tagged component found'

  const tagName = target.tagName.toLowerCase()
  const role = target.getAttribute('role')
  const kind =
    target.dataset.igKind?.trim()
    ?? role
    ?? (tagName === 'input' ? (target.getAttribute('type') ?? 'input') : tagName)

  const label =
    target.dataset.igLabel?.trim()
    ?? target.getAttribute('aria-label')?.trim()
    ?? target.getAttribute('title')?.trim()
    ?? ('value' in target && typeof target.value === 'string' ? normalizeText(target.value) : '')
    ?? ''

  const fallbackText = normalizeText(target.textContent)
  const detail = truncateText(label || fallbackText)

  return detail ? `${kind} "${detail}"` : kind
}

function readMarker(target: EventTarget | null, boundary: HTMLElement | null): ComponentMarker {
  const rawTarget = target instanceof HTMLElement ? target : null
  const interactiveElement = findInteractiveElement(target, boundary)
  const componentElement = findElementByAttr(interactiveElement ?? rawTarget, boundary, 'igComponent')
  const slotElement = findElementByAttr(interactiveElement ?? rawTarget, boundary, 'igSlot')
  const inspectTarget = interactiveElement ?? slotElement ?? componentElement ?? rawTarget
  const element = slotElement ?? componentElement ?? inspectTarget
  const componentEntries = readComponentEntries(inspectTarget, boundary)
  const componentChain = componentEntries.map((entry) => entry.name)
  const slotChain = readAttrChain(inspectTarget, boundary, 'igSlot')
  return {
    componentEntries,
    componentChain,
    slotChain,
    element,
    rect: element?.getBoundingClientRect() ?? null,
    summary: readElementSummary(inspectTarget),
    componentName: componentChain[0] ?? componentElement?.dataset.igComponent?.trim() ?? null,
    slotName: slotChain[0] ?? slotElement?.dataset.igSlot?.trim() ?? null,
    groupedLayers: groupEntriesByLayer(componentEntries),
  }
}

function formatChain(chain: string[]): string {
  if (chain.length === 0) return 'No tagged component found'
  return chain.join(' -> ')
}

export function ComponentInspector({
  active,
  storyLabel,
  storyLayer,
  children,
}: {
  active: boolean
  storyLabel: string
  storyLayer: LayerId
  children: React.ReactNode
}) {
  const boundaryRef = React.useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = React.useState<ComponentMarker | null>(null)
  const [selected, setSelected] = React.useState<ComponentMarker | null>(null)

  React.useEffect(() => {
    if (!active) {
      setHovered(null)
      setSelected(null)
    }
  }, [active])

  React.useEffect(() => {
    if (!active || !selected?.element) return undefined

    const update = () => {
      setSelected((current) => {
        if (!current?.element) return current
        return { ...current, rect: current.element.getBoundingClientRect() }
      })
    }

    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [active, selected?.element])

  React.useEffect(() => {
    if (!active) return undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  const activeMarker = selected ?? hovered

  const handleMouseMoveCapture = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return
    if ((event.target as HTMLElement | null)?.closest('[data-ig-inspector-ui="true"]')) return
    if (selected) return
    setHovered(readMarker(event.target, boundaryRef.current))
  }, [active, selected])

  const handleMouseLeaveCapture = React.useCallback(() => {
    if (!active || selected) return
    setHovered(null)
  }, [active, selected])

  const handleClickCapture = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return
    if ((event.target as HTMLElement | null)?.closest('[data-ig-inspector-ui="true"]')) return
    event.preventDefault()
    event.stopPropagation()
    setSelected(readMarker(event.target, boundaryRef.current))
  }, [active])

  return (
    <div
      ref={boundaryRef}
      data-ig-component={storyLabel}
      data-ig-layer={storyLayer}
      onMouseMoveCapture={handleMouseMoveCapture}
      onMouseLeave={handleMouseLeaveCapture}
      onClickCapture={handleClickCapture}
      style={{ position: 'relative', minHeight: '100%' }}
    >
      {children}
      {active ? (
        <>
          {activeMarker?.rect ? (
            <div
              aria-hidden
              style={{
                position: 'fixed',
                left: activeMarker.rect.left,
                top: activeMarker.rect.top,
                width: activeMarker.rect.width,
                height: activeMarker.rect.height,
                border: '2px solid #4ade80',
                background: 'rgba(74, 222, 128, 0.10)',
                borderRadius: 6,
                pointerEvents: 'none',
                zIndex: 100000,
                boxSizing: 'border-box',
              }}
            />
          ) : null}
          <div
            data-ig-inspector-ui="true"
            style={{
              position: 'fixed',
              right: 16,
              bottom: 16,
              width: 360,
              maxWidth: 'calc(100vw - 32px)',
              padding: 14,
              borderRadius: 12,
              background: 'rgba(10, 14, 20, 0.92)',
              color: 'var(--ig-color-text-primary)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 14px 40px rgba(0, 0, 0, 0.35)',
              zIndex: 100001,
              backdropFilter: 'blur(14px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <strong style={{ fontSize: 13, letterSpacing: '0.02em' }}>Component Inspect</strong>
              <button
                type="button"
                onClick={() => setSelected(null)}
                style={{
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 10px',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                Clear
              </button>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ig-color-text-muted)' }}>
              Click any element in the canvas to freeze its component chain. Press Escape to reset.
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ig-color-text-muted)' }}>Selected element</div>
            <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.5 }}>
              {(selected ?? hovered)?.summary ?? 'No tagged component found'}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ig-color-text-muted)' }}>Selected component</div>
            <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.5 }}>
              {(selected ?? hovered)?.componentName ?? 'No tagged component found'}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ig-color-text-muted)' }}>Usage slot</div>
            <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.5 }}>
              {(selected ?? hovered)?.slotName ?? 'No slot metadata'}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ig-color-text-muted)' }}>Component chain</div>
            <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.5 }}>
              {formatChain((selected ?? hovered)?.componentChain ?? [])}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ig-color-text-muted)' }}>Slot chain</div>
            <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.5 }}>
              {formatChain((selected ?? hovered)?.slotChain ?? [])}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ig-color-text-muted)' }}>Reused by layer</div>
            <div style={{ marginTop: 6, display: 'grid', gap: 8 }}>
              {LAYER_ORDER.map((layer) => (
                <div key={layer}>
                  <div style={{ fontSize: 11, color: 'var(--ig-color-text-muted)' }}>{LAYER_LABELS[layer]}</div>
                  <div style={{ marginTop: 2, fontSize: 13, lineHeight: 1.5 }}>
                    {formatChain((selected ?? hovered)?.groupedLayers?.[layer] ?? [])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
