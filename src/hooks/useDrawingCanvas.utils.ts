import type { DrawingObject } from './useDrawingCanvas'

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

export function hitTestPoint(
  mx: number, my: number, obj: DrawingObject, radius: number,
): boolean {
  return obj.type === 'point' && Math.hypot(mx - obj.x, my - obj.y) < radius
}

export function hitTestRect(mx: number, my: number, obj: DrawingObject): boolean {
  if (obj.type !== 'rect' || !obj.w || !obj.h) return false
  return mx >= obj.x && mx <= obj.x + obj.w && my >= obj.y && my <= obj.y + obj.h
}

export function hitTestHandle(
  mx: number, my: number, obj: DrawingObject, radius: number,
): string | null {
  if (obj.type !== 'rect' || !obj.w || !obj.h) return null
  const corners: [string, number, number][] = [
    ['nw', obj.x, obj.y],
    ['ne', obj.x + obj.w, obj.y],
    ['sw', obj.x, obj.y + obj.h],
    ['se', obj.x + obj.w, obj.y + obj.h],
  ]
  for (const [name, cx, cy] of corners) {
    if (Math.hypot(mx - cx, my - cy) < radius) return name
  }
  return null
}

let nextId = 1
export function genId(): string { return `draw-${nextId++}` }

export function disableTextSelection() {
  document.body.style.userSelect = 'none'
  document.body.style.webkitUserSelect = 'none'
}

export function enableTextSelection() {
  document.body.style.userSelect = ''
  document.body.style.webkitUserSelect = ''
}
